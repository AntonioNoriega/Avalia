-- ── Avalia · schema (parcial Sprint 1) ──────────────────────
CREATE TYPE rol_usuario AS ENUM ('admin','valuador','analista_mercado','cliente');

CREATE TABLE usuarios (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre        text NOT NULL,
  email         text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  rol           rol_usuario NOT NULL DEFAULT 'cliente',
  activo        boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
