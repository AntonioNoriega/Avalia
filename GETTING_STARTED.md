# Avalia — Guía de arranque del proyecto

Guía para poner en marcha el proyecto desde cero, pensada para que cualquier
integrante nuevo pueda levantarlo sin contexto previo. Para la visión y arquitectura
completas ver `docs/PLANEACION_SISTEMA_VALUACION.md`.

> **Avalia** es un sistema de valuación automatizada de inmuebles (AVM) con chatbot:
> a partir de las características de una propiedad y de datos de mercado comparables,
> estima un valor con su rango y nivel de confianza.

---

## 1. Tecnologías

- **Backend:** Node.js (≥ 20) + Express, módulos ESM.
- **Base de datos:** PostgreSQL vía **Supabase**.
- **Frontend:** React + Vite + TailwindCSS *(en construcción — siguiente sprint)*.
- **Auth:** JWT + bcrypt.

## 2. Prerrequisitos

| Herramienta | Versión | Para qué |
|-------------|---------|----------|
| Node.js     | ≥ 20 (recomendado 22) | Correr backend/frontend |
| npm         | viene con Node | Instalar dependencias |
| Git         | cualquiera | Control de versiones |
| Cuenta Supabase | gratuita | Base de datos PostgreSQL |

Verifica: `node -v` y `npm -v`.

## 3. Clonar el repositorio

```bash
git clone https://github.com/AntonioNoriega/avalia.git
cd avalia
```

## 4. Crear el proyecto en Supabase

1. Entra a https://supabase.com → **New project**.
2. Nombre: `avalia`. Región: la más cercana (Americas). Guarda la **Database password**.
3. En *Security*, se recomienda **desmarcar** "Automatically expose new tables"
   (el backend usa la *service_role key* del lado del servidor, no expone tablas al navegador).
4. Cuando termine de aprovisionar, ve a **Project Settings → API** y copia:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (secreta) → `SUPABASE_SERVICE_ROLE_KEY`

## 5. Crear el esquema de la base de datos

En Supabase → **SQL Editor** → pega y ejecuta el contenido de
`backend/src/config/schema.sql`. Esto crea ENUMs, tablas, triggers y la vista de mercado.

## 6. Configurar el backend

```bash
cd backend
npm install
cp .env.example .env       # en Windows: copy .env.example .env
```

Edita `backend/.env` con tus valores reales:

```ini
PORT=4000
JWT_SECRET=pon_aqui_un_secreto_largo_y_aleatorio
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # service_role, NO la anon
```

> `.env` está en `.gitignore`: **nunca** se sube al repo. La service_role key es secreta.

## 6.1 Chatbot e IA (opcional)

El asistente funciona **sin ninguna API key** (modo rule-based: interpreta la
descripción del inmueble y lanza el motor de valuación). Si más adelante quieres
respuestas con IA, agrega `GEMINI_API_KEY` en `backend/.env`; mientras no exista,
todo opera en modo local.

## 7. Cargar datos demo (seed)

```bash
npm run seed
```

Crea usuarios de prueba, zonas de Acapulco y comparables de mercado realistas.

**Usuarios demo** (contraseña: `Avalia2026`):

| Rol | Email |
|-----|-------|
| admin | admin@avalia.mx |
| valuador | valuador@avalia.mx |
| analista_mercado | analista@avalia.mx |
| cliente | cliente@avalia.mx |

## 8. Levantar el backend

```bash
npm run dev      # recarga en caliente (node --watch)
# o
npm start
```

Prueba: abre http://localhost:4000/api/health → debe responder `{ "ok": true, ... }`.

Login de prueba:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@avalia.mx","password":"Avalia2026"}'
```

## 9. Levantar el frontend

```bash
cd frontend
npm install
cp .env.example .env     # en Windows: copy .env.example .env
npm run dev              # http://localhost:5173
```

El `frontend/.env` define la URL del backend:
```ini
VITE_API_URL=http://localhost:4000/api
```

Con el backend corriendo, abre http://localhost:5173 e inicia sesión con un usuario demo.
El frontend incluye: login, dashboard por rol, inmuebles (alta + valuar), detalle de
valuación con gráfica y exportación a PDF, mercado, asistente (chatbot) y perfil.

---

## Estructura del proyecto

```
backend/src/
  config/      supabase.js · schema.sql · seed.js
  middleware/  auth · rbac · validate · error
  modules/     auth · inmuebles · mercado · valuacion · chatbot · reportes · dashboard
  index.js     app Express + montaje de rutas
frontend/src/  pages · services · components   (pendiente)
docs/          planeación y evidencias
diseno/        logo, guía de estilo, assets de marca
```

## Scripts (backend)

| Comando | Acción |
|---------|--------|
| `npm run dev` | Levanta la API con recarga en caliente |
| `npm start` | Levanta la API |
| `npm run seed` | Carga datos demo (requiere schema ya creado) |

## Endpoints disponibles (Sprint 1)

| Método | Ruta | Rol |
|--------|------|-----|
| GET | `/api/health` | público |
| POST | `/api/auth/login` | público |
| GET | `/api/auth/me` | autenticado |
| PATCH | `/api/auth/me/password` | autenticado |
| GET/POST | `/api/inmuebles` · `/:id` (GET/PUT/DELETE) | dueño / valuador / admin |
| GET | `/api/mercado/comparables` · `/zonas` · `/zonas/:id/stats` | autenticado |
| POST | `/api/mercado/comparables` | admin / analista_mercado |
| GET/POST | `/api/valuacion` · `/:id` | dueño / valuador / admin |
| PATCH | `/api/valuacion/:id/estado` | valuador / admin |
| POST | `/api/chatbot/mensaje` · GET `/sesiones` | autenticado |
| GET | `/api/dashboard/stats` | autenticado (payload por rol) |
| GET | `/api/reportes/valuacion/:id/pdf` | autenticado |

## Flujo de trabajo con Git

```bash
git checkout -b feature/HU-x-descripcion
# ...trabajar...
git add -A && git commit -m "feat(scope): mensaje"
git push -u origin feature/HU-x-descripcion
# Pull Request -> merge a master con --no-ff
```

## Solución de problemas

- **`Falta SUPABASE_URL...`**: el `.env` no está bien configurado o no se está usando
  `--env-file=.env` (ya incluido en los scripts).
- **Login devuelve "Credenciales inválidas"**: ¿corriste `npm run seed`? ¿usas la contraseña `Avalia2026`?
- **Errores de tabla inexistente**: falta ejecutar `schema.sql` en Supabase.
- **Git en Windows, locks (`HEAD.lock` / `index.lock`)**:
  ```bash
  rm -f .git/HEAD.lock .git/index.lock
  git add -A && git commit -m "mensaje"
  ```
- **Push a GitHub da 403**: estás autenticado con otra cuenta. Limpia la credencial en
  *Administrador de credenciales de Windows* y entra con la cuenta dueña del repo (token PAT).

## Estado del desarrollo

Backend completo (auth, inmuebles, mercado, motor de valuación, chatbot, dashboard,
reportes PDF) y frontend completo (React + Vite + Tailwind). Pendiente de pulido:
toasts de alertas en tiempo real, carga CSV de comparables y pruebas automatizadas.
Ver `docs/PLANEACION_SISTEMA_VALUACION.md`.
