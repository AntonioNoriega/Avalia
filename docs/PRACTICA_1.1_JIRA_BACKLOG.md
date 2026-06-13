# Práctica 1.1: SCRUM — Definición de Epics, Stories y Tasks en Jira
**Proyecto:** Avalia (Sistema de Valuación Automatizada de Inmuebles)  
**Responsable:** Antonio Noriega Esteban (asumiendo los roles de Product Owner, Scrum Master y Development Team)  
**Fecha de Inicio del Proyecto:** 05 de mayo de 2026  
**Fecha de Fin del Proyecto:** 20 de julio de 2026  

---

## 1. Roles en el Equipo Scrum (Simulado)
Para efectos de esta práctica, Antonio Noriega Esteban desempeña los tres roles clave del framework Scrum:
*   **Product Owner (PO):** Define la visión del producto, prioriza y retroalimenta el Product Backlog, asegurando el valor de negocio.
*   **Scrum Master (SM):** Facilita las ceremonias, elimina impedimentos, organiza los Daily Scrums y asegura el cumplimiento del flujo de trabajo.
*   **Development Team (Devs):** Estima el esfuerzo en el Sprint Planning, crea las ramas secundarias en Git, desarrolla las tareas técnicas y agrega los commits necesarios.

---

## 2. Definición del Product Backlog Completo en Jira (Orden Cronológico)

A continuación se detalla el backlog completo cargado en Jira, ordenado de forma secuencial y cronológica según el ciclo de desarrollo del proyecto.

### [EPIC-1] Diseño y Branding
*   **Descripción:** Conceptualización de marca, logotipo oficial y diseño del manual de identidad corporativa (Sprint 0).

#### ── Historia de Usuario: HU-1.1 — Identidad y Logotipo Oficial (Estimación: 5 SP)
*   **Sintaxis:** Como *Equipo de desarrollo*, quiero diseñar el logotipo de la marca para contar con una identidad gráfica del sistema.
*   **Criterios de Aceptación:**
    1. **Dado** que se elaboran bocetos, **Cuando** se definen propuestas en alta fidelidad y el PO las aprueba, **Entonces** se exportan los assets finales.
*   **Tareas (Tasks):**
    *   `TASK-1.1.1` Elaborar propuestas y bocetos en baja fidelidad.
    *   `TASK-1.1.2` Diseñar logotipo final en formato vectorial de alta fidelidad.

#### ── Historia de Usuario: HU-1.2 — Guía de Estilo y Assets (Estimación: 3 SP)
*   **Sintaxis:** Como *Equipo de desarrollo*, quiero definir el manual de identidad para garantizar consistencia visual en el sistema.
*   **Tareas (Tasks):**
    *   `TASK-1.2.1` Definir la paleta cromática, tipografías oficiales y retículas de diseño.

---

### [EPIC-2] Fundaciones y Autenticación
*   **Descripción:** Configuración inicial del entorno del proyecto, base de datos de usuarios y seguridad mediante autenticación y roles de acceso (RBAC).

#### ── Historia de Usuario: HU-2.1 — Gestión de Usuarios y Roles (Estimación: 5 SP)
*   **Sintaxis:** Como *Administrador*, quiero gestionar los usuarios y sus roles asignados (admin, valuador, analista_mercado, cliente) para controlar el acceso a los módulos del sistema.
*   **Criterios de Aceptación:**
    1. **Dado** que estoy autenticado como admin, **Cuando** ingreso nombre, email y selecciono un rol del ENUM `rol_usuario`, **Entonces** se guarda el usuario.
    2. **Dado** que hay un solo usuario `admin`, **Cuando** intento eliminarlo, **Entonces** se cancela con error: "No se puede eliminar al único administrador".
*   **Tareas (Tasks):**
    *   `TASK-2.1.1` [BD] Crear esquema de tabla `usuarios` y tipo ENUM `rol_usuario` en Supabase.
    *   `TASK-2.1.2` [Backend] Desarrollar controladores y rutas REST para el CRUD de usuarios.
    *   `TASK-2.1.3` [Backend] Desarrollar middleware de roles (`rbac.middleware.js`).
    *   `TASK-2.1.4` [Frontend] Diseñar e implementar pantalla de administración de usuarios.

#### ── Historia de Usuario: HU-2.2 — Autenticación Segura (Estimación: 3 SP)
*   **Sintaxis:** Como *Usuario del sistema*, quiero iniciar sesión con mis credenciales para acceder de forma segura a mi dashboard.
*   **Criterios de Aceptación:**
    1. **Dado** que ingreso correo y contraseña correctos, **Cuando** envío el formulario, **Entonces** obtengo un JWT firmado y me redirige.
*   **Tareas (Tasks):**
    *   `TASK-2.2.1` [Backend] Configurar middleware de autenticación JWT (`auth.middleware.js`).
    *   `TASK-2.2.2` [Backend] Crear endpoint `POST /api/auth/login` con bcrypt (12 rounds) y rate limiting.
    *   `TASK-2.2.3` [Frontend] Desarrollar pantalla y formulario de login responsive.

#### ── Historia de Usuario: HU-2.3 — Gestión de Perfil de Usuario (Estimación: 2 SP)
*   **Sintaxis:** Como *Usuario autenticado*, quiero visualizar mi perfil y poder cambiar mi contraseña para mantener mi cuenta segura.
*   **Criterios de Aceptación:**
    1. **Dado** que estoy logueado, **Cuando** cambio mi contraseña validando la contraseña actual, **Entonces** se guarda el nuevo hash.
*   **Tareas (Tasks):**
    *   `TASK-2.3.1` [Backend] Implementar endpoint `PATCH /api/auth/me/password`.
    *   `TASK-2.3.2` [Frontend] Crear vista `/perfil` con formulario de cambio de contraseña.

---

### [EPIC-3] Inmuebles y Datos de Mercado
*   **Descripción:** Gestión de las propiedades que los clientes registran para valuar y carga de datos comparables de mercado.

#### ── Historia de Usuario: HU-3.1 — Registro de Inmuebles del Cliente (Estimación: 5 SP)
*   **Sintaxis:** Como *Cliente*, quiero registrar las características de mi inmueble para solicitar su valuación.
*   **Criterios de Aceptación:**
    1. **Dado** que capturo superficie, recámaras y zona válidos, **Cuando** guardo el inmueble, **Entonces** se liga a mi ID de usuario.
*   **Tareas (Tasks):**
    *   `TASK-3.1.1` [BD] Diseñar tablas `inmuebles` y `zonas` con llaves foráneas.
    *   `TASK-3.1.2` [Backend] Crear endpoints de inmuebles (`GET/POST /api/inmuebles`).
    *   `TASK-3.1.3` [Frontend] Crear interfaz de usuario para agregar y listar inmuebles.

#### ── Historia de Usuario: HU-3.2 — Administración de Comparables (Estimación: 5 SP)
*   **Sintaxis:** Como *Analista de Mercado*, quiero gestionar el dataset de comparables para mantener actualizados los precios de referencia.
*   **Criterios de Aceptación:**
    1. **Dado** que capturo una propiedad comparable, **Cuando** la guardo, **Entonces** el `precio_m2` se calcula de forma automática.
*   **Tareas (Tasks):**
    *   `TASK-3.2.1` [BD] Crear tabla `comparables_mercado` con columna generada `precio_m2`.
    *   `TASK-3.2.2` [Backend] Implementar endpoints de administración de mercado e ingesta de CSV.
    *   `TASK-3.2.3` [Frontend] Crear interfaz para subir archivos CSV y visualizar comparables por zona.

#### ── Historia de Usuario: HU-3.3 — Carga de Datos Semilla (Estimación: 2 SP)
*   **Sintaxis:** Como *Equipo de desarrollo*, quiero contar con un seed de datos realista para realizar pruebas del motor de valuación.
*   **Tareas (Tasks):**
    *   `TASK-3.3.1` [Backend] Desarrollar script `seed.js` idempotente con datos realistas de zonas y comparables.

---

### [EPIC-4] Motor de Valuación (AVM)
*   **Descripción:** Lógica matemática y financiera del motor AVM para calcular el estimado, rango de precios y confianza.

#### ── Historia de Usuario: HU-4.1 — Motor de Valuación Automatizada (Estimación: 8 SP)
*   **Sintaxis:** Como *Cliente/Valuador*, quiero obtener el valor estimado de un inmueble basado en comparables de mercado.
*   **Criterios de Aceptación:**
    1. **Dado** un inmueble registrado, **Cuando** ejecuto la valuación, **Entonces** el motor selecciona comparables y aplica factores de ajuste.
*   **Tareas (Tasks):**
    *   `TASK-4.1.1` [Backend] Implementar algoritmo de selección de comparables por zona y tipo.
    *   `TASK-4.1.2` [Backend] Desarrollar la lógica de factores de ajuste (superficie, conservación, antigüedad).
    *   `TASK-4.1.3` [Backend] Implementar persistencia de valuaciones en tabla `valuaciones` y `valuacion_comparables`.

#### ── Historia de Usuario: HU-4.2 — Trazabilidad y Gráficos (Estimación: 5 SP)
*   **Sintaxis:** Como *Usuario*, quiero ver el desglose y justificación de mi valuación para comprender el cálculo.
*   **Criterios de Aceptación:**
    1. **Dado** que consulto una valuación, **Cuando** veo el detalle, **Entonces** el sistema muestra los comparables usados y una gráfica de dispersión.
*   **Tareas (Tasks):**
    *   `TASK-4.2.1` [Backend] Crear endpoint `GET /api/valuacion/:id` con su detalle de comparables.
    *   `TASK-4.2.2` [Frontend] Diseñar vista de detalle de la valuación usando gráficas en Recharts.

#### ── Historia de Usuario: HU-4.3 — Firma y Revisión de Valuaciones (Estimación: 3 SP)
*   **Sintaxis:** Como *Valuador*, quiero revisar y cambiar el estado de una valuación para avalar su veracidad.
*   **Tareas (Tasks):**
    *   `TASK-4.3.1` [Backend] Endpoint `PATCH /api/valuacion/:id/estado` para transiciones de estado.
    *   `TASK-4.3.2` [Frontend] Desarrollar controles de flujo de estado (borrador -> calculada -> firmada).

---

### [EPIC-5] Chatbot Conversacional
*   **Descripción:** Capa conversacional para interactuar con el sistema de valuación mediante lenguaje natural.

#### ── Historia de Usuario: HU-5.1 — Asistente de Valuación por Chat (Estimación: 8 SP)
*   **Sintaxis:** Como *Usuario*, quiero describir mi inmueble en lenguaje natural en el chat para obtener un avalúo estimado directo.
*   **Tareas (Tasks):**
    *   `TASK-5.1.1` [Backend] Desarrollar el parser de intenciones por regex o LLM para extraer atributos.
    *   `TASK-5.1.2` [Backend] Crear endpoint `POST /api/chatbot/mensaje`.
    *   `TASK-5.1.3` [Frontend] Diseñar widget conversacional de chat flotante.

#### ── Historia de Usuario: HU-5.2 — Refinamiento Conversacional (Estimación: 5 SP)
*   **Sintaxis:** Como *Usuario*, quiero pedir modificaciones sobre el inmueble valuado en el chat para ver la variación del precio.
*   **Tareas (Tasks):**
    *   `TASK-5.2.1` [Backend] Implementar manejo de contexto de sesión del chat.
    *   `TASK-5.2.2` [Backend] Lógica de recálculo dinámico en base a inputs conversacionales.

#### ── Historia de Usuario: HU-5.3 — Historial del Chatbot (Estimación: 3 SP)
*   **Sintaxis:** Como *Cliente*, quiero acceder a mis conversaciones pasadas para consultar estimaciones anteriores.
*   **Tareas (Tasks):**
    *   `TASK-5.3.1` [BD] Tablas `chat_sesiones` y `chat_mensajes`.
    *   `TASK-5.3.2` [Frontend] Sidebar de navegación de sesiones históricas.

---

### [EPIC-6] Dashboard, Reportes y Pulido
*   **Descripción:** Pantallas de visualización de datos específicas para cada rol y exportación de reportes PDF.

#### ── Historia de Usuario: HU-6.1 — Dashboard Condicional por Rol (Estimación: 5 SP)
*   **Sintaxis:** Como *Usuario logueado*, quiero ver un panel de control con métricas específicas de mi rol.
*   **Tareas (Tasks):**
    *   `TASK-6.1.1` [Backend] Implementar endpoint `GET /api/dashboard/stats` con datos según rol.
    *   `TASK-6.1.2` [Frontend] Crear componentes condicionales del Dashboard (Admin, Valuador, Analista, Cliente).

#### ── Historia de Usuario: HU-6.2 — Exportación de Reportes PDF (Estimación: 5 SP)
*   **Sintaxis:** Como *Valuador/Cliente*, quiero descargar un reporte PDF formal con el resultado de la valuación.
*   **Tareas (Tasks):**
    *   `TASK-5.2.1` [Backend] Integrar jsPDF + autotable para maquetar el reporte PDF.
    *   `TASK-5.2.2` [Frontend] Botón de exportación e integración con el servicio.

#### ── Historia de Usuario: HU-6.3 — Página 404 y Sistema de Toasts (Estimación: 3 SP)
*   **Sintaxis:** Como *Usuario*, quiero recibir alertas de confirmación/error en tiempo real y una vista amigable de ruta inexistente.
*   **Tareas (Tasks):**
    *   `TASK-6.3.1` [Frontend] Crear componente contextual de Toast de notificaciones.
    *   `TASK-6.3.2` [Frontend] Diseñar página de error 404.

---

## 3. Planificación de Sprints (Sprint Plannings)

Para asegurar que todo el Product Backlog se desarrolle de manera estructurada, se asignaron las historias de usuario a los respectivos sprints a lo largo de las 11 semanas del proyecto:

### Sprint 0: Setup & Branding (05 de mayo al 15 de mayo de 2026)
*   **Objetivo del Sprint:** Configurar la infraestructura técnica inicial del repositorio, bases de datos y definir la guía de marca y diseño del logotipo.
*   **Capacidad del Sprint:** 8 SP
*   **Historias Seleccionadas:**
    *   HU-1.1: Identidad y Logotipo Oficial (5 SP)
    *   HU-1.2: Guía de Estilo y Assets (3 SP)

### Sprint 1: Fundaciones, Auth e Inmuebles (18 de mayo al 29 de mayo de 2026)
*   **Objetivo del Sprint:** Implementar el control de usuarios, inicio de sesión seguro por JWT, el CRUD inicial de inmuebles y carga de datos semilla.
*   **Capacidad del Sprint:** 15 SP
*   **Historias Seleccionadas:**
    *   HU-2.1: Gestión de Usuarios y Roles (5 SP)
    *   HU-2.2: Autenticación Segura (3 SP)
    *   HU-2.3: Gestión de Perfil de Usuario (2 SP)
    *   HU-3.1: Registro de Inmuebles del Cliente (5 SP)
    *   HU-3.3: Carga de Datos Semilla (2 SP)

### Sprint 2: Motor de Valuación (01 de junio al 12 de junio de 2026)
*   **Objetivo del Sprint:** Implementar el algoritmo de valuación automatizada AVM, la justificación de comparables y la firma de los peritos.
*   **Capacidad del Sprint:** 21 SP
*   **Historias Seleccionadas:**
    *   HU-3.2: Administración de Comparables (5 SP)
    *   HU-4.1: Motor de Valuación Automatizada (8 SP)
    *   HU-4.2: Trazabilidad y Gráficos (5 SP)
    *   HU-4.3: Firma y Revisión de Valuaciones (3 SP)

### Sprint 3: Chatbot y Dashboards por Rol (15 de junio al 26 de junio de 2026)
*   **Objetivo del Sprint:** Desarrollar el asistente por chat conversacional, las consultas inteligentes y el dashboard condicional según rol.
*   **Capacidad del Sprint:** 21 SP
*   **Historias Seleccionadas:**
    *   HU-5.1: Asistente de Valuación por Chat (8 SP)
    *   HU-5.2: Refinamiento Conversacional (5 SP)
    *   HU-5.3: Historial del Chatbot (3 SP)
    *   HU-6.1: Dashboard Condicional por Rol (5 SP)

### Sprint 4: Reportes, QA y Pulido (29 de junio al 10 de julio de 2026)
*   **Objetivo del Sprint:** Finalizar la exportación de avalúos a reportes PDF, añadir notificaciones en tiempo real, pantallas de error y realizar el cierre general de bugs.
*   **Capacidad del Sprint:** 8 SP
*   **Historias Seleccionadas:**
    *   HU-6.2: Exportación de Reportes PDF (5 SP)
    *   HU-6.3: Página 404 y Sistema de Toasts (3 SP)

### Cierre del Proyecto: Integración y Entrega (13 de julio al 20 de julio de 2026)
*   **Objetivo:** Pruebas finales de extremo a extremo, preparación de despliegues y presentación final de las prácticas de desarrollo.

---

## 4. Evidencias de Daily Scrums (Sprint 1)

Sincronizaciones diarias de 15 minutos realizadas durante la primera semana del Sprint 1:

### Daily Scrum — Lunes 18/05/2026
*   **Avances:** El Product Owner priorizó el Backlog. El Scrum Master creó las columnas Kanban en Jira. El equipo de desarrollo instaló dependencias en `backend` y comenzó a preparar el archivo `schema.sql`.
*   **Impedimentos:** Ninguno detectado.

### Daily Scrum — Martes 19/05/2026
*   **Avances:** El Dev Team terminó de estructurar el archivo `schema.sql` en Supabase con los ENUMs de roles e inmuebles, y configuró `.env`. Se inició con `TASK-2.2.2` (endpoint de login).
*   **Impedimentos:** Ninguno.

### Daily Scrum — Miércoles 20/05/2026
*   **Avances:** Se completó el endpoint de login y el middleware de autenticación JWT. Hoy se inicia con `rbac.middleware.js`.
*   **Impedimentos:** Un problema menor con el formato de expiración del token JWT que se resolvió cambiándolo a la cadena `'24h'`.

### Daily Scrum — Jueves 21/05/2026
*   **Avances:** Finalizaron los endpoints de usuarios y roles junto con el middleware de validación RBAC. Hoy se inicia con la tabla y endpoints del CRUD de inmuebles (HU-3.1).
*   **Impedimentos:** Ninguno.

### Daily Scrum — Viernes 22/05/2026
*   **Avances:** Se terminó el CRUD de inmuebles y se integró el script `seed.js` para poblar datos iniciales. El sprint concluyó al 100% de cumplimiento en sus historias comprometidas.
*   **Impedimentos:** Ninguno.
