# Práctica 3.2: Plan de Pruebas de Software

## Formato para la Realización y Presentación de Pruebas de Software

---

### 1. Información General

| Campo | Detalle |
| :--- | :--- |
| **Nombre del Proyecto** | Avalia — Sistema de Valuación Automatizada de Inmuebles |
| **Versión del Software** | v1.0.0 |
| **Fecha de Prueba** | 27 de junio de 2026 |
| **Responsable(s)** | Antonio Noriega |
| **Tipo de Prueba** | Integración / Sistema / Aceptación |

---

### 2. Plan y Diseño de Pruebas

| Elemento | Descripción |
| :--- | :--- |
| **Objetivo de la Prueba** | Validar el flujo funcional crítico de la aplicación: el inicio de sesión (RBAC), el renderizado visual de comparables con imágenes, el cálculo del motor de valuación (AVM) justificándolo con imágenes, y el orquestador del chatbot. |
| **Criterios de Entrada** | 1. Servidor Backend Express corriendo en el puerto 4000.<br>2. Frontend React compilado/ejecutándose mediante Vite en desarrollo.<br>3. Conexión de red activa a Supabase y catálogo seeded con comparables y fotos asociadas. |
| **Criterios de Salida** | 1. Ejecución del 100% de los casos de prueba diseñados.<br>2. Lograr un porcentaje mínimo de éxito del 90% (todos los casos críticos OK).<br>3. Ausencia de errores fatales (crashes de servidor o congelamiento de pantalla). |
| **Entorno de Pruebas** | **Hardware**: Intel Core i7 / 16GB RAM / Conexión a Internet.<br>**Software**: Windows 11, Node.js v20.12.0, PostgreSQL (Supabase Cloud).<br>**Navegador**: Google Chrome v120.0 (con DevTools abiertas para monitoreo de consola). |
| **Datos de Prueba** | 1. Credenciales de Cliente demo: `cliente@avalia.mx` / `Avalia2026`<br>2. Datos del Inmueble Objetivo: Tipo departamento, zona Costa Azul, 80 m² construcción, 2 recámaras, 2 baños, 5 años de antigüedad, estado de conservación bueno. |

---

### 3. Casos de Prueba

| ID | Caso de Prueba | Pasos de Ejecución | Datos Usados | Resultado Esperado | Resultado Obtenido | Estado (OK / Falla) | Observaciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Login de usuario válido | 1. Ingresar correo y contraseña correctos.<br>2. Clic en "Iniciar sesión". | `cliente@avalia.mx` / `Avalia2026` | Acceso concedido, token JWT almacenado en localStorage, redirección al Dashboard. | Acceso concedido. Redirecciona exitosamente mostrando datos de Carla Cliente. | **OK** | Sin observaciones. |
| **TC-02** | Acceso con contraseña incorrecta | 1. Ingresar correo de cliente registrado.<br>2. Ingresar contraseña errónea.<br>3. Clic en "Iniciar sesión". | `cliente@avalia.mx` / `wrongpass` | Denegar acceso, mostrar mensaje de error en pantalla: "Credenciales inválidas". | Muestra mensaje de error en un toast rojo y permanece en la página de login. | **OK** | Validación correcta en backend y frontend. |
| **TC-03** | Visualización de Mercado con Fotos | 1. Navegar a "/mercado".<br>2. Seleccionar colonia de búsqueda.<br>3. Cambiar a "Vista Mosaico". | Colonia "Costa Azul" | Renderizar estadísticas del m² prom. de la zona y un listado de tarjetas (cards) con fotos reales de Unsplash y especificaciones detalladas. | Muestra la gráfica de estadísticas y un mosaico de tarjetas de casas/departamentos con fotos nítidas e indicadores. | **OK** | Se verifica que las imágenes cargan correctamente sin links rotos. |
| **TC-04** | Cálculo Automático de Avalúo (AVM) | 1. Navegar a "/inmuebles".<br>2. Seleccionar departamento demo y presionar "Valuar". | Inmueble registrado (90 m² Costa Azul, 2 rec, 2 baños) | El backend selecciona comparables, aplica factores de ajuste y retorna estimado, rango min-max y nivel de confianza. | El frontend muestra el estimado de $2.4M aprox., rango de desviación y nivel de confianza en verde/amarillo. | **OK** | Persiste correctamente la valuación en estado "calculada" en la DB. |
| **TC-05** | Justificación del Avalúo con Fotos | 1. Entrar al detalle de la valuación generada.<br>2. Inspeccionar la sección "Comparables Utilizados". | Valuación generada en TC-04 | Desplegar tarjetas de las propiedades de mercado utilizadas con sus fotos, el factor de ajuste y peso asignado. | Se listan las propiedades de referencia con sus fotos de Unsplash, factor (ej. 0.98x) y pesos ponderados. | **OK** | Permite que el cliente visualice y aprecie de forma clara los inmuebles de referencia. |
| **TC-06** | Consulta en lenguaje natural (Chatbot) | 1. Entrar a la pestaña "Asistente".<br>2. Escribir descripción de un inmueble en lenguaje común. | *"Tengo un departamento de 90 m2 en Costa Azul con 2 recámaras y 2 baños"* | El chatbot procesa el texto, identifica variables, invoca al motor de valuación y responde explicando los datos. | El bot extrae los datos del departamento, calcula el valor estimado y genera un enlace al reporte. | **OK** | Orquestación conversacional y matemática integrada con éxito. |

---

### 4. Resumen Final de la Prueba

| Métrica | Resultado |
| :--- | :--- |
| **Total de casos probados** | 6 |
| **Casos exitosos** | 6 |
| **Casos con fallas** | 0 |
| **Porcentaje de éxito** | 100% |

#### Observaciones Generales
El sistema se comportó de manera sumamente estable en todas las pruebas de integración del flujo principal. La inclusión de imágenes de mercado integradas en la base de datos (con links a Unsplash de alta calidad) y su visualización en cuadrícula (mosaico) en el módulo de mercado y en la justificación de valuaciones representa un salto estético y funcional enorme para el usuario. Le permite apreciar de forma real en qué se basa el avalúo de su patrimonio.

#### Recomendaciones
1. **Pruebas de Caja Blanca**: Implementar suites de pruebas unitarias automáticas con Jest o Vitest sobre el módulo del motor de valuación (`valuacion.engine.js`) para asegurar consistencia matemática ante cambios futuros.
2. **Pruebas de Esfuerzo / Rendimiento**: Probar la velocidad de respuesta del chatbot ante 50 o 100 consultas simultáneas simuladas en producción.
3. **Usabilidad**: Agregar filtros avanzados en la vista mosaico del mercado para buscar por rangos de precio o cantidad de recámaras.

---

### 5. Firma del Responsable / Evaluador

*   **Nombre**: Antonio Noriega
*   **Cargo / Rol**: Product Owner / Scrum Master / QA Lead
*   **Firma / Validación**: *[Validado electrónicamente - Antonio Noriega]*
*   **Fecha de cierre de la prueba**: 27 de junio de 2026
