-- ════════════════════════════════════════════════════════════════
--  Avalia · Esquema de base de datos (PostgreSQL / Supabase)
--  Ejecutar en: Supabase → SQL Editor (una sola vez).
-- ════════════════════════════════════════════════════════════════

-- ── Extensiones ──────────────────────────────────────────────────
create extension if not exists "pgcrypto";   -- gen_random_uuid()

-- ── ENUMs (estados controlados) ──────────────────────────────────
do $$ begin
  create type rol_usuario       as enum ('admin','valuador','analista_mercado','cliente');
exception when duplicate_object then null; end $$;
do $$ begin
  create type tipo_inmueble     as enum ('casa','departamento','terreno','local','oficina');
exception when duplicate_object then null; end $$;
do $$ begin
  create type estado_conserva   as enum ('nuevo','bueno','regular','remodelar');
exception when duplicate_object then null; end $$;
do $$ begin
  create type estado_valuacion  as enum ('borrador','calculada','revisada','firmada','descartada');
exception when duplicate_object then null; end $$;
do $$ begin
  create type nivel_confianza   as enum ('alta','media','baja');
exception when duplicate_object then null; end $$;
do $$ begin
  create type origen_comparable as enum ('seed','csv','manual');
exception when duplicate_object then null; end $$;

-- ── Trigger genérico: actualizar updated_at ──────────────────────
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; $$ language plpgsql;

-- ── usuarios ─────────────────────────────────────────────────────
create table if not exists usuarios (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  email         text unique not null,
  password_hash text not null,
  rol           rol_usuario not null default 'cliente',
  activo        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
drop trigger if exists trg_usuarios_updated on usuarios;
create trigger trg_usuarios_updated before update on usuarios
  for each row execute function set_updated_at();

-- ── zonas (normaliza ubicación) ──────────────────────────────────
create table if not exists zonas (
  id        uuid primary key default gen_random_uuid(),
  estado    text not null,
  municipio text not null,
  colonia   text not null,
  cp        text,
  lat       numeric(9,6),
  lng       numeric(9,6),
  unique (estado, municipio, colonia)
);

-- ── inmuebles (el bien a valuar) ─────────────────────────────────
create table if not exists inmuebles (
  id               uuid primary key default gen_random_uuid(),
  usuario_id       uuid not null references usuarios(id) on delete cascade,
  tipo             tipo_inmueble not null,
  zona_id          uuid not null references zonas(id),
  superficie_m2    numeric(10,2) not null check (superficie_m2 > 0),
  construccion_m2  numeric(10,2) not null check (construccion_m2 >= 0),
  recamaras        int  not null default 0,
  banos            int  not null default 0,
  estacionamientos int  not null default 0,
  antiguedad_anios int  not null default 0,
  estado_conserva  estado_conserva not null default 'bueno',
  imagen_url       text,
  lat              numeric(9,6),
  lng              numeric(9,6),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
drop trigger if exists trg_inmuebles_updated on inmuebles;
create trigger trg_inmuebles_updated before update on inmuebles
  for each row execute function set_updated_at();

-- ── comparables_mercado (referencias de mercado) ─────────────────
create table if not exists comparables_mercado (
  id               uuid primary key default gen_random_uuid(),
  tipo             tipo_inmueble not null,
  zona_id          uuid not null references zonas(id),
  superficie_m2    numeric(10,2) not null,
  construccion_m2  numeric(10,2) not null check (construccion_m2 > 0),
  recamaras        int  not null default 0,
  banos            int  not null default 0,
  estacionamientos int  not null default 0,
  antiguedad_anios int  not null default 0,
  estado_conserva  estado_conserva not null default 'bueno',
  precio           numeric(14,2) not null check (precio > 0),
  precio_m2        numeric(14,2) generated always as (precio / construccion_m2) stored,
  fecha_operacion  date not null default current_date,
  origen           origen_comparable not null default 'seed',
  created_at       timestamptz not null default now()
);
create index if not exists idx_comp_tipo_zona on comparables_mercado(tipo, zona_id);

-- ── valuaciones (resultado del motor) ────────────────────────────
create table if not exists valuaciones (
  id              uuid primary key default gen_random_uuid(),
  inmueble_id     uuid not null references inmuebles(id) on delete cascade,
  valuador_id     uuid references usuarios(id),
  estado          estado_valuacion not null default 'borrador',
  valor_estimado  numeric(14,2),
  valor_min       numeric(14,2),
  valor_max       numeric(14,2),
  confianza       nivel_confianza,
  num_comparables int not null default 0,
  metodo          text not null default 'comparativo_mercado',
  notas           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
drop trigger if exists trg_valuaciones_updated on valuaciones;
create trigger trg_valuaciones_updated before update on valuaciones
  for each row execute function set_updated_at();

-- ── valuacion_comparables (detalle 1NF, NO JSONB) ────────────────
create table if not exists valuacion_comparables (
  id                  uuid primary key default gen_random_uuid(),
  valuacion_id        uuid not null references valuaciones(id) on delete cascade,
  comparable_id       uuid not null references comparables_mercado(id),
  precio_m2_ajustado  numeric(14,2) not null,
  peso                numeric(6,4) not null default 1,
  factor_ajuste       numeric(6,4) not null default 1
);

-- ── chatbot ──────────────────────────────────────────────────────
create table if not exists chat_sesiones (
  id         uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references usuarios(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists chat_mensajes (
  id           uuid primary key default gen_random_uuid(),
  sesion_id    uuid not null references chat_sesiones(id) on delete cascade,
  rol          text not null check (rol in ('user','bot')),
  texto        text not null,
  valuacion_id uuid references valuaciones(id),
  created_at   timestamptz not null default now()
);

-- ── Vista: estadísticas de mercado por zona y tipo ───────────────
create or replace view v_mercado_zona as
select
  zona_id,
  tipo,
  count(*)                                                          as n,
  round(avg(precio_m2), 2)                                          as precio_m2_prom,
  round(percentile_cont(0.5) within group (order by precio_m2)::numeric, 2) as precio_m2_mediana,
  round(coalesce(stddev(precio_m2), 0), 2)                          as precio_m2_desv
from comparables_mercado
group by zona_id, tipo;
