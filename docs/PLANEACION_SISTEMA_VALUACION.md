# Avalia — Sistema de Valuación Automatizada de Inmuebles
### Documento maestro de planeación (Sprint 0 / base de proyecto)

> **Nombre de trabajo:** *Avalia* (avalúo + IA).
> **Stack base:** Node.js + Express (ESM) · PostgreSQL vía Supabase · React + Vite + TailwindCSS + Heroicons.
> **Reutiliza la metodología del sistema SRM** (RBAC por roles, dashboard condicional por rol, reportes PDF como servicio, seed idempotente, convenciones en español).
> **Fecha base:** 12 de junio de 2026.

---

## 1. Visión y propuesta de valor

Avalia es un **AVM (Automated Valuation Model)** para inmuebles: a partir de las características de una propiedad y de datos de mercado de propiedades comparables, calcula un **valor estimado**, un **rango (mínimo–máximo)** y un **nivel de confianza**, justificando el resultado con los comparables usados. Encima del motor vive un **chatbot** que recibe la descripción del inmueble en lenguaje natural, dispara la valuación y explica el resultado de forma conversacional.

**Problema que resuelve.** Hoy una valuación tradicional es lenta, cara y depende de un perito. Avalia entrega un estimado inmediato y trazable, útil para: dueños que quieren saber cuánto vale su propiedad, compradores que validan un precio de lista, e instituciones (inmobiliarias, crédito) que necesitan un primer filtro antes de un avalúo formal.

**Diferenciador.** No es una "calculadora a ciegas": cada estimado viene acompañado de los comparables reales que lo sustentan y de una explicación en lenguaje natural vía chatbot.

### Objetivos
1. Estimar el valor de un inmueble en segundos a partir de sus características.
2. Mostrar siempre la **justificación** (comparables + ajustes aplicados).
3. Permitir refinar el estimado de forma conversacional ("¿y si tuviera una recámara más?").
4. Dar a cada rol (valuador, cliente, analista, admin) exactamente la vista que necesita.
5. Generar un **reporte PDF** de valuación descargable.

### Fuera de alcance (v1)
- Avalúo legal/pericial con validez oficial (Avalia da un estimado, no un dictamen certificado).
- Datos de mercado en tiempo real por scraping (v1 usa **dataset simulado realista** vía seed; la ingesta externa queda para una fase posterior).
- App móvil nativa (la web es responsive).

---

## 2. Usuarios y roles (RBAC)

Siguiendo el patrón del SRM (`rbac.middleware.js` con helpers por combinación de roles), definimos la matriz **antes** de codear para evitar bugs de permisos.

| Rol | Quién es | Qué hace como función principal |
|-----|----------|--------------------------------|
| **admin** | Administrador del sistema | Gestiona usuarios, catálogos y configuración. Acceso total. |
| **valuador** | Perito / analista de valuación | Crea, revisa y "firma" valuaciones; ajusta parámetros del motor; exporta reportes. |
| **analista_mercado** | Curador de datos | Administra el dataset de comparables de mercado (alta, carga CSV, depuración). |
| **cliente** | Solicitante (dueño/comprador) | Pide valuaciones de sus inmuebles, ve su historial, usa el chatbot. |

**Regla clave (heredada del SRM):** al definir un endpoint, preguntar "¿qué rol *necesita* esto como parte de su función?". Ej.: el **valuador** debe poder crear valuaciones (no solo admin); el **cliente** debe poder lanzar una valuación de su propio inmueble.

Helpers RBAC propuestos:
```js
export const soloAdmin       = rbac('admin')
export const gestionMercado  = rbac('admin', 'analista_mercado')
export const operaValuacion  = rbac('admin', 'valuador')
export const creaValuacion   = rbac('admin', 'valuador', 'cliente')
export const todos           = rbac('admin', 'valuador', 'analista_mercado', 'cliente')
```

Auth: JWT + `authMiddleware`, bcryptjs (12 rounds), endpoint propio `PATCH /api/auth/me/password`, rate limiting en login.

---

## 3. Arquitectura general

```
backend/src/
  config/        # supabase.js, schema.sql, seed.js
  middleware/    # auth, rbac, validate, rateLimit, error
  modules/
    auth/        # login, perfil, cambio de password
    inmuebles/   # CRUD de inmuebles del cliente
    mercado/     # comparables: alta, carga CSV, vistas de mercado
    valuacion/   # MOTOR AVM: cálculo de estimado + comparables + confianza
    chatbot/     # parser de intención + orquestación del motor
    reportes/    # PDF de valuación (jsPDF + autotable)
    dashboard/   # stats condicionales por rol
  jobs/          # (futuro) refresco de índices de mercado por zona

frontend/src/
  pages/
    auth/        # login, perfil, 404
    dashboard/   # Dashboard.jsx -> sub-componente por rol
    inmuebles/   # alta y listado de inmuebles
    valuacion/   # detalle de valuación + mapa de comparables + gráficas
    mercado/     # gestión de comparables (analista)
    chatbot/     # widget conversacional
  services/      # *.service.js (wrappers axios por dominio)
  components/    # layout/ (Navbar, Sidebar), ui/ (tablas, badges, toasts)
```

Convenciones (heredadas): nombres/comentarios/UI en **español**; errores con `throw { status, message }` + middleware central; validación de body con esquemas; secciones con separador `// ── Sección ──`.

---

## 4. Modelo de datos (schema.sql)

Diseño 1NF con ENUMs, triggers de `updated_at`, columnas calculadas y vistas agregadas (en vez de columnas desnormalizadas).

### ENUMs
```sql
CREATE TYPE tipo_inmueble    AS ENUM ('casa','departamento','terreno','local','oficina');
CREATE TYPE estado_conserva  AS ENUM ('nuevo','bueno','regular','remodelar');
CREATE TYPE estado_valuacion AS ENUM ('borrador','calculada','revisada','firmada','descartada');
CREATE TYPE nivel_confianza  AS ENUM ('alta','media','baja');
CREATE TYPE rol_usuario      AS ENUM ('admin','valuador','analista_mercado','cliente');
CREATE TYPE origen_comparable AS ENUM ('seed','csv','manual');
```

### Tablas principales

**usuarios** — `id, nombre, email (unique), password_hash, rol rol_usuario, activo, created_at, updated_at`.

**zonas** — catálogo de ubicaciones para agrupar mercado: `id, estado, municipio, colonia, cp, lat, lng`. (Normaliza la ubicación; evita strings libres repetidos.)

**inmuebles** — el bien a valuar: `id, usuario_id (FK), tipo tipo_inmueble, zona_id (FK), superficie_m2, construccion_m2, recamaras, banos, estacionamientos, antiguedad_anios, estado_conserva, lat, lng, created_at, updated_at`.

**comparables_mercado** — propiedades de referencia (el "mercado"): `id, tipo tipo_inmueble, zona_id (FK), superficie_m2, construccion_m2, recamaras, banos, estacionamientos, antiguedad_anios, estado_conserva, precio, precio_m2 GENERATED ALWAYS AS (precio / NULLIF(construccion_m2,0)) STORED, fecha_operacion, origen origen_comparable, created_at`.

**valuaciones** — resultado del motor: `id, inmueble_id (FK), valuador_id (FK, nullable si la pidió cliente), estado estado_valuacion, valor_estimado, valor_min, valor_max, confianza nivel_confianza, num_comparables, metodo, notas, created_at, updated_at`.

**valuacion_comparables** — tabla detalle (1NF, NO JSONB): qué comparables se usaron y con qué ajuste: `id, valuacion_id (FK), comparable_id (FK), precio_m2_ajustado, peso, factor_ajuste`.

**chat_sesiones / chat_mensajes** — historial del chatbot: sesión por usuario; mensajes con `rol ('user'|'bot'), texto, valuacion_id (nullable), created_at`.

### Triggers y derivados
- Trigger genérico `set_updated_at()` en `usuarios`, `inmuebles`, `valuaciones`.
- `precio_m2` como columna `GENERATED ALWAYS AS` en `comparables_mercado`.
- Categoría de confianza puede derivarse del número/dispersión de comparables (calculada en el service, persistida en `confianza`).

### Vistas (agregados de mercado)
```sql
-- Precio promedio por m² por zona y tipo (insumo del motor y de las gráficas)
CREATE VIEW v_mercado_zona AS
SELECT zona_id, tipo,
       COUNT(*)             AS n,
       AVG(precio_m2)       AS precio_m2_prom,
       PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY precio_m2) AS precio_m2_mediana,
       STDDEV(precio_m2)    AS precio_m2_desv
FROM comparables_mercado
GROUP BY zona_id, tipo;
```

---

## 5. Motor de valuación (cómo calcula Avalia)

Enfoque **comparativo de mercado** (el estándar de los AVM), con ajustes y un nivel de confianza derivado de la dispersión.

**Paso 1 — Selección de comparables.** Filtrar `comparables_mercado` por mismo `tipo` y misma `zona_id` (o zonas vecinas si hay pocos), con `fecha_operacion` reciente. Se requiere un mínimo (ej. ≥ 3) para calcular; si no, confianza = baja o se amplía el radio.

**Paso 2 — Ajuste de cada comparable.** Cada comparable aporta un `precio_m2` que se ajusta por diferencias frente al inmueble objetivo mediante factores: superficie/construcción, antigüedad, estado de conservación, número de recámaras/baños, estacionamientos. (Factores configurables por el valuador; en v1 valores por defecto razonables.)
```
precio_m2_ajustado = precio_m2_comparable × Π(factores_de_ajuste)
```

**Paso 3 — Estimado.** Combinar los `precio_m2_ajustado` (media ponderada por cercanía/recencia) y multiplicar por la construcción del inmueble objetivo:
```
valor_estimado = construccion_m2_objetivo × precio_m2_ponderado
```

**Paso 4 — Rango y confianza.** El rango sale de la dispersión (desviación estándar / percentiles) de los comparables ajustados:
```
valor_min, valor_max = estimado ∓ k·dispersión
confianza = alta  (muchos comparables, baja dispersión)
            media (intermedio)
            baja  (pocos comparables o alta dispersión)
```

**Paso 5 — Persistencia y trazabilidad.** Guardar la `valuacion` y, en `valuacion_comparables`, cada comparable usado con su `precio_m2_ajustado`, `peso` y `factor_ajuste`. Esto permite reconstruir y explicar el resultado.

**Refinamiento conversacional.** El chatbot puede re-lanzar el motor cambiando un atributo ("una recámara más") y mostrar el delta de valor.

> **Mejora futura (opcional):** regresión lineal/hedónica sobre los comparables como segundo método, comparando contra el comparativo simple.

---

## 6. Chatbot

Capa conversacional sobre el motor. Diseño pragmático para v1 (sin depender de un LLM externo obligatorio):

- **Entrada:** el usuario describe el inmueble ("departamento de 80 m², 2 recámaras, en la colonia X, 5 años de antigüedad").
- **Parser de intención:** módulo `chatbot/` extrae atributos (tipo, superficie, zona, recámaras, etc.) hacia un objeto estructurado. Puede ser por reglas/regex en v1 o por un LLM si se conecta uno.
- **Orquestación:** con el objeto estructurado, llama internamente al `valuacion.service` y obtiene estimado + comparables.
- **Respuesta:** explica en lenguaje natural ("Estimo ~\$2.4M, rango \$2.2M–\$2.6M, confianza media, basado en 7 comparables de la zona") y ofrece acciones (guardar valuación, exportar PDF, refinar).
- **Persistencia:** `chat_sesiones` + `chat_mensajes`, ligando la valuación generada.

Endpoint: `POST /api/chatbot/mensaje` → devuelve respuesta + (si aplica) `valuacion_id`.

---

## 7. Endpoints backend (resumen)

| Módulo | Endpoint | Rol(es) |
|--------|----------|---------|
| auth | `POST /api/auth/login` | público |
| auth | `GET /api/auth/me` · `PATCH /api/auth/me/password` | todos |
| inmuebles | `GET/POST /api/inmuebles` · `GET/PUT/DELETE /api/inmuebles/:id` | creaValuacion (dueño) |
| mercado | `GET /api/mercado/comparables` · `GET /api/mercado/zonas/:id/stats` | todos (lectura) |
| mercado | `POST /api/mercado/comparables` · `POST /api/mercado/cargar-csv` | gestionMercado |
| valuacion | `POST /api/valuacion` (calcula) · `GET /api/valuacion/:id` · `GET /api/valuacion` | creaValuacion |
| valuacion | `PATCH /api/valuacion/:id/estado` (revisar/firmar) | operaValuacion |
| chatbot | `POST /api/chatbot/mensaje` · `GET /api/chatbot/sesiones` | todos |
| reportes | `GET /api/reportes/valuacion/:id/pdf` | creaValuacion |
| dashboard | `GET /api/dashboard/stats` | todos (payload por rol) |

---

## 8. Frontend y dashboard por rol

Un solo `Dashboard.jsx` que renderiza sub-componente según `data.rol` (patrón SRM):
- **admin:** KPIs globales (valuaciones del mes, usuarios, tamaño del dataset de mercado), tendencia de precio/m² por zona, valuaciones recientes.
- **valuador:** cola de valuaciones por revisar/firmar, últimas calculadas, accesos rápidos.
- **analista_mercado:** zonas con pocos comparables, últimas cargas, conteo del dataset.
- **cliente:** sus inmuebles, sus valuaciones, botón "Nueva valuación" y chatbot.

Páginas de utilidad estándar desde el primer sprint de pulido: **/perfil**, **404 personalizada**, **toast de alertas con polling (~30s)**, acceso al perfil desde la Navbar. Gráficas con Recharts. Reporte de valuación a PDF con jsPDF + autotable (header con marca/color, tabla de comparables, footer con paginación, codificación de color por confianza: alta=verde, media=amarillo, baja=rojo).

---

## 9. Product Backlog (Epics → Stories → Tasks)  ⟶ insumo de Práctica 1.1 (Jira)

Estructura lista para cargar en Jira (proyecto SCRUM). Cada historia trae criterios de aceptación; las tasks son el desglose técnico para el Sprint Planning del Development Team.

### EPIC 1 — Fundaciones y autenticación
- **HU-1.1** Como *admin* quiero gestionar usuarios y roles para controlar el acceso.
  - *Criterios:* alta/edición/baja de usuarios; asignación de rol; no se puede borrar el último admin.
  - Tasks: schema `usuarios` + ENUM rol · CRUD usuarios (controller/service/routes) · pantalla admin de usuarios · pruebas RBAC.
- **HU-1.2** Como *usuario* quiero iniciar sesión de forma segura.
  - *Criterios:* login con JWT; password hasheada (bcrypt 12); rate limit; error claro en credenciales inválidas.
  - Tasks: `authMiddleware` · login endpoint + rate limit · pantalla login · manejo de sesión en frontend.
- **HU-1.3** Como *usuario* quiero ver y editar mi perfil y cambiar mi contraseña.
  - Tasks: `PATCH /api/auth/me/password` (valida password actual) · página `/perfil` · acceso desde Navbar.

### EPIC 2 — Inmuebles y datos de mercado
- **HU-2.1** Como *cliente* quiero registrar un inmueble con sus características.
  - *Criterios:* formulario valida superficie>0, tipo válido, zona seleccionable; el inmueble queda ligado al usuario.
  - Tasks: schema `inmuebles` + `zonas` · CRUD inmuebles · formulario + servicio axios · validación de body.
- **HU-2.2** Como *analista_mercado* quiero administrar el dataset de comparables.
  - *Criterios:* alta manual y carga CSV; ver comparables por zona; `precio_m2` calculado automáticamente.
  - Tasks: schema `comparables_mercado` + `precio_m2` GENERATED · endpoints mercado · carga CSV · pantalla de gestión.
- **HU-2.3** Como *equipo* quiero un seed realista de zonas y comparables.
  - *Criterios:* `seed.js` idempotente para catálogos; dataset coherente con ENUMs; corre con `node --env-file=.env`.
  - Tasks: catálogo de zonas · generador de comparables realistas · upsert idempotente.

### EPIC 3 — Motor de valuación (AVM)
- **HU-3.1** Como *cliente/valuador* quiero obtener un valor estimado de un inmueble.
  - *Criterios:* devuelve estimado, min, max, confianza y nº de comparables; persiste la valuación.
  - Tasks: selección de comparables · factores de ajuste · cálculo ponderado · rango+confianza · persistir `valuaciones` + `valuacion_comparables`.
- **HU-3.2** Como *usuario* quiero ver la justificación (comparables usados) de mi valuación.
  - *Criterios:* lista de comparables con su precio/m² ajustado y peso; vista de detalle con gráfica.
  - Tasks: endpoint detalle · vista `valuacion/:id` · gráfica Recharts · mapa de comparables.
- **HU-3.3** Como *valuador* quiero revisar y firmar una valuación.
  - *Criterios:* transición de estado borrador→calculada→revisada→firmada; solo valuador/admin firma.
  - Tasks: `PATCH /api/valuacion/:id/estado` · control de transiciones · UI de estados.

### EPIC 4 — Chatbot
- **HU-4.1** Como *usuario* quiero pedir una valuación describiendo el inmueble en lenguaje natural.
  - *Criterios:* el bot extrae atributos, lanza el motor y responde con estimado + explicación.
  - Tasks: parser de intención · orquestación al `valuacion.service` · endpoint `chatbot/mensaje` · widget de chat.
- **HU-4.2** Como *usuario* quiero refinar el estimado de forma conversacional.
  - Tasks: manejo de contexto de sesión · recálculo con atributo modificado · mostrar delta.
- **HU-4.3** Como *usuario* quiero ver mi historial de conversaciones.
  - Tasks: schema `chat_sesiones`/`chat_mensajes` · endpoint historial · UI.

### EPIC 5 — Dashboard, reportes y pulido
- **HU-5.1** Dashboard diferenciado por rol (un endpoint, payload condicional).
- **HU-5.2** Reporte PDF de valuación (servicio reutilizable, color por confianza).
- **HU-5.3** Página 404 + toast de alertas con polling.

### EPIC 6 — Diseño y branding (Prácticas 2.x)
- **HU-6.1** Logotipo: 3 propuestas wireframe → elección → mockup alta fidelidad → presentaciones (redes/web).
- **HU-6.2** Guía de estilo: tipografías, retícula/layout, iconografía, paleta, estilo de imágenes, variaciones de logo. (La paleta debe coincidir con el logo de la 2.1.)

> **Nota Jira (heredada):** para vincular historias a épicas en proyectos next-gen usar `parent: { key: "SCRUM-XX" }` al editar el issue — **no** `customfield_10014`.

---

## 10. Roadmap de sprints  ⟶ insumo de Práctica 1.3 (Gantt)

Sprints de 1 semana (ajustable). Cronograma base para el diagrama de Gantt en Jira.

| Sprint | Fechas (base 2026) | Foco | Epics |
|--------|--------------------|------|-------|
| Sprint 0 | 15–19 jun | Setup: repos Git, Jira, este documento, schema inicial, seed mínimo, branding (logo + guía) | Setup + EPIC 6 |
| Sprint 1 | 22–26 jun | Fundaciones + auth + inmuebles + mercado | EPIC 1, EPIC 2 |
| Sprint 2 | 29 jun–3 jul | Motor de valuación + justificación | EPIC 3 |
| Sprint 3 | 6–10 jul | Chatbot + dashboard | EPIC 4, EPIC 5.1 |
| Sprint 4 | 13–17 jul | Reportes PDF, pulido (404/toasts/perfil), QA | EPIC 5 |

Hitos clave (para el Gantt): logo aprobado (fin S0), schema congelado (fin S1), motor funcional (fin S2), chatbot demo (fin S3), release v1 (fin S4).

---

## 11. Control de versiones (Git)  ⟶ insumo de Práctica 1.2

- Repo creado por el **Scrum Master**; integrantes clonan y trabajan en **ramas secundarias** (`feature/<historia>`), commits descriptivos, y piden autorización para hacer merge a `master`.
- Convención de ramas: `feature/HU-3.1-motor-valuacion`, `fix/...`, `docs/...`.
- Convención de commits: `tipo(scope): mensaje` (ej. `feat(valuacion): cálculo de estimado por comparables`).
- Gotcha Windows/Git Bash (heredado): si falla por locks, `rm -f .git/HEAD.lock .git/index.lock` y reintentar.

---

## 12. Dirección de branding  ⟶ insumo de Prácticas 2.1 y 2.2

Propuesta de partida (a validar con el equipo de diseño):

- **Concepto del logo:** combinar idea de *hogar/inmueble* (techo, llave, m²) con *dato/IA* (punto, nodo, gráfica). 3 wireframes a explorar: (a) techo + punto de dato, (b) monograma "A" formado por un tejado, (c) burbuja de chat con símbolo de casa.
- **Paleta sugerida** (la guía de estilo 2.2 debe coincidir con el logo 2.1):
  - Primario: azul confianza `#1E4D8C`.
  - Secundario: verde valor `#2E9E6B` (refuerza la codificación "alta confianza = verde").
  - Acento: ámbar `#F2A93B` (estados intermedios / CTAs).
  - Neutros: `#0F172A` texto, `#64748B` secundario, `#F8FAFC` fondo.
  - Semáforo de confianza: alta `#2E9E6B` · media `#F2A93B` · baja `#E2574C`.
- **Tipografía sugerida:** títulos *Poppins/Sora*; cuerpo *Inter*. Iconografía: Heroicons (consistente con el stack).
- **Layout:** retícula de 12 columnas, espaciado base 8px, componentes con esquinas redondeadas suaves.

> Estos colores ya están pensados para que el dashboard y los PDF (semáforo de confianza) sean coherentes con la marca.

---

## 13. Checklist de arranque (Sprint 0)
1. Crear repos Git + estructura de carpetas; conectar Jira.
2. `schema.sql` con ENUMs, triggers `updated_at`, vistas de mercado, 1NF.
3. Matriz de permisos por endpoint **antes** de codear.
4. Dashboard por rol diseñado desde el inicio (un endpoint, payload condicional).
5. `seed.js` realista temprano (zonas + comparables) para probar UI.
6. Perfil, 404 y toasts en el primer sprint de pulido (no al final).
7. Reportes PDF como servicio reutilizable.
8. Logo aprobado + guía de estilo antes de maquetar pantallas finales.
