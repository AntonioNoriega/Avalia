# Práctica 2.2: Guía de Estilo para la Aplicación Web
**Proyecto:** Avalia (Sistema de Valuación Automatizada de Inmuebles)  
**Responsable:** Antonio Noriega Esteban (desempeñando roles de PO, SM y Dev Team)  
**Fecha:** Junio de 2026  

---

## 1. Objetivo
Diseñar y estructurar la guía de estilo visual de la aplicación web del proyecto **Avalia**, definiendo la tipografía, la retícula y el layout, la iconografía, la paleta cromática, el estilo de imágenes, las variaciones de logotipo y las directrices de los componentes de la interfaz de usuario. Esta guía garantiza la consistencia visual y la identidad gráfica homogénea en el desarrollo frontend.

> **Nota de coherencia:** El logotipo oficial diseñado en la **Práctica 2.1** coincide exactamente con la paleta de colores y la tipografía formalizadas en esta guía.

---

## 2. Introducción
Una guía de estilo es una herramienta de gobernanza de diseño que unifica criterios entre diseñadores y desarrolladores. Para **Avalia**, el sistema visual debe proyectar **confianza, precisión y modernidad**, facilitando la legibilidad de datos numéricos y financieros complejos (precios, rangos de avalúo) y haciendo fluida la interacción con el chatbot.

---

## 3. Estructura y Directrices de la Guía de Estilo

### 3.1 Tipografías (Poppins & Inter)
Se seleccionaron dos familias tipográficas de Google Fonts optimizadas para entornos web, garantizando legibilidad y una jerarquía clara:

*   **Tipografía Display / Títulos:** **Poppins** (SemiBold, peso 600). Es una tipografía geométrica sans-serif con formas circulares limpias, ideal para títulos principales, cabeceras de módulos y para el wordmark corporativo.
*   **Tipografía de Texto / UI:** **Inter** (Regular 400 y Medium 500). Diseñada específicamente para pantallas de computadoras. Su excelente altura de la "x" y espaciado de caracteres permiten una lectura sumamente cómoda en campos de datos, tablas de comparables, chats y reportes.

#### Escala Tipográfica (Jerarquía):
*   **H1 (Títulos de página):** 32px | Peso: 600 (Poppins) | Para títulos de vistas principales.
*   **H2 (Títulos de sección):** 24px | Peso: 600 (Poppins) | Para encabezados de módulos o tarjetas principales.
*   **H3 (Subtítulos):** 18px | Peso: 500 (Inter) | Para títulos de tarjetas internas u opciones de menú.
*   **Body (Texto de párrafo):** 15px | Peso: 400 (Inter) | Interlínea (line-height): 1.6. Usado para descripciones y mensajes del chat.
*   **Caption (Textos de apoyo):** 13px | Peso: 400 (Inter) | Para metadatos, leyendas de tablas y rangos de precios.
*   **Overline (Etiquetas superiores):** 12px | Peso: 700 (Inter) | Con espaciado de letras expandido (letter-spacing: 1px) para categorizaciones.
*   *Alternativas web seguras:* En caso de fallas de carga de red, la tipografía Display caerá a `"Segoe UI", sans-serif` y la tipografía de UI a `system-ui, sans-serif`.

*Lámina tipográfica de referencia:* [lam_tipografia.svg](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/guia/lam_tipografia.svg) | [Versión PNG](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/png/lam_tipografia.png)

---

### 3.2 Retícula y Layout
El sistema de maquetación del frontend se estructura sobre bases rígidas para garantizar la responsividad en cualquier resolución de pantalla (desktop, tablet, mobile):

*   **Retícula Principal:** Grid de **12 columnas** para la vista de escritorio, con un **medianil (gutter) de 24px**.
*   **Contenedor Máximo:** El layout web tiene un ancho de contención máximo de **1200px** para evitar la deformación horizontal en monitores ultra-wide.
*   **Escala de Espaciado (Multiplicador de 8px):** Todos los paddings, margins y gaps entre elementos UI deben apegarse estrictamente a múltiplos de 8 píxeles para mantener proporciones armónicas:
    *   `8px` (micro-espacio) / `16px` (elementos adyacentes) / `24px` (padding interno de tarjetas) / `32px` (separación entre secciones) / `48px` y `64px` (márgenes de layouts principales).
*   **Radios de Esquina (Corner Radius):**
    *   `4px` — Para checkboxes, tooltips y bordes pequeños.
    *   `8px` — Para botones estándar, inputs de formularios y badges.
    *   `12px` — Para tarjetas de valuación, modales y widgets flotantes.
    *   `16px` — Para contenedores de dashboard principales.

*Lámina de maquetación de referencia:* [lam_reticula.svg](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/guia/lam_reticula.svg) | [Versión PNG](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/png/lam_reticula.png)

---

### 3.3 Iconografía
El estilo iconográfico de la aplicación web de **Avalia** sigue un concepto de línea minimalista:

*   **Estilo Visual:** Iconos lineales (*outline*), con un grosor de trazo constante de **2px** y terminales ligeramente redondeadas.
*   **Biblioteca Base:** Se adopta la biblioteca **Heroicons** (de los creadores de TailwindCSS), garantizando congruencia visual con el stack frontend del proyecto.
*   **Paleta de Aplicación:** Se renderizan en color azul primario (`#1E4D8C`) para botones interactivos o gris neutro (`#64748B`) para estados inactivos.
*   **Catálogo de Iconos Clave:**
    *   *Casa:* Módulo de inmuebles.
    *   *Lupa:* Lanzar valuación.
    *   *Gráfica:* Módulo de comparables de mercado.
    *   *Documento PDF:* Descargar reporte.
    *   *Chat:* Asistente conversacional.
    *   *Usuario:* Perfil y credenciales.
    *   *Ubicación:* Zonas y mapas.
    *   *Escudo:* Indicador de nivel de confianza.

*Lámina de iconografía de referencia:* [lam_iconografia.svg](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/guia/lam_iconografia.svg) | [Versión PNG](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/png/lam_iconografia.png)

---

### 3.4 Paleta de Colores
La paleta se divide en colores de marca, colores neutros del sistema y colores semánticos funcionales:

| Tipo | Nombre Técnico | Código HEX | Uso en Interfaz |
| :--- | :--- | :--- | :--- |
| **Primario** | Azul Confianza | `#1E4D8C` | Botones principales, cabeceras, enlaces y elementos activos de navegación. |
| **Secundario** | Verde Valor | `#2E9E6B` | Botones de acción clave, marcadores de inmuebles valuados y confianza alta. |
| **Acento** | Ámbar Acento | `#F2A93B` | Botones secundarios, notificaciones preventivas y confianza media. |
| **Neutro** | Tinta | `#0F172A` | Texto principal, títulos sobre fondos claros, tipografía del logotipo. |
| **Neutro** | Gris | `#64748B` | Textos secundarios, descripciones largas, bordes inactivos. |
| **Neutro** | Borde | `#CBD5E1` | Líneas divisorias, bordes de inputs de formulario estándar. |
| **Neutro** | Fondo | `#F8FAFC` | Fondo de toda la aplicación web. |
| **Neutro** | Blanco | `#FFFFFF` | Fondo de tarjetas, menús laterales, modales y barra superior. |
| **Semántico** | Rojo Confianza Baja | `#E2574C` | Indicador de confianza de valuación baja y mensajes de error críticos. |

*Lámina de color de referencia:* [lam_paleta.svg](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/guia/lam_paleta.svg) | [Versión PNG](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/png/lam_paleta.png)

---

### 3.5 Estilo de las Imágenes
Las imágenes del sistema web (por ejemplo, fotos de portadas de inmuebles en la valuación) deben apegarse a lineamientos que eviten la saturación visual:

*   **Origen:** Fotografía real de inmuebles. Se prefiere iluminación natural directa y encuadres geométricos limpios.
*   **Tratamiento Técnico:**
    *   Proporciones estándar: **16:9** (para banners) o **7:5** (para miniaturas de tarjetas).
    *   Bordes redondeados a **10px** para coincidir con la escala del layout.
    *   *Overlay de legibilidad:* Cuando se coloque texto encima de una imagen de inmueble, se debe aplicar un degradado oscuro en CSS (`linear-gradient(to bottom, transparent, rgba(15, 23, 42, 0.78))`) en la base de la imagen para asegurar el contraste de la tipografía blanca.
*   **Qué Evitar:** Evitar el uso de imágenes de stock genéricas con filtros de saturación artificiales o de colores ajenos a la marca.

*Lámina de imágenes de referencia:* [lam_imagenes.svg](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/guia/lam_imagenes.svg) | [Versión PNG](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/png/lam_imagenes.png)

---

### 3.6 Variación de Logotipos
El uso de las variantes del logotipo en la web se rige bajo las siguientes reglas de aplicación:
1.  **Logotipo Principal (Horizontal):** Se usa por defecto en la barra de navegación web (`Navbar.jsx`) sobre fondo blanco, o en pantallas de inicio (Login) con suficiente aire visual.
2.  **Isotipo (Ícono):** Utilizado en el favicon del sitio web y en el sidebar cuando este se colapsa a formato mini.
3.  **Logotipo Inverso:** Reservado para el pie de página (footer) de la web o bloques de color oscuro (como el banner de bienvenida del Dashboard).

---

### 3.7 Componentes de la Interfaz de Usuario (UI)
Se maquetaron y codificaron en CSS los componentes básicos que estructuran la aplicación:

1.  **Botones:**
    *   *Botón Primario:* Fondo Azul (`#1E4D8C`), texto blanco, esquinas redondeadas (`8px`). Usado para guardar, enviar y confirmaciones de alta jerarquía.
    *   *Botón Acción:* Fondo Verde (`#2E9E6B`), texto blanco. Usado para "Lanzar Valuación" y operaciones aritméticas.
    *   *Botón Secundario:* Sin fondo, borde Azul de `1.5px`, texto azul. Para cancelar o ir al historial.
    *   *Botón Fantasma:* Fondo gris claro (`#F1F5F9`), texto gris oscuro (`#64748B`), para opciones secundarias de escaso peso visual.
2.  **Badges del Semáforo de Confianza:**
    *   *Confianza Alta:* Caja verde claro (`#DCFCE7`), texto verde oscuro (`#166534`), ícono circular verde (`#2E9E6B`).
    *   *Confianza Media:* Caja ámbar claro (`#FEF3C7`), texto café/ámbar (`#92400E`), ícono circular ámbar (`#F2A93B`).
    *   *Confianza Baja:* Caja roja clara (`#FEE2E2`), texto rojo oscuro (`#991B1B`), ícono circular rojo (`#E2574C`).
3.  **Tarjeta de Valuación (Valuation Card):**
    *   Contenedor blanco con borde suave (`#E2E8F0`), esquinas redondeadas a `12px` y sombra ligera (*box-shadow*).
    *   Desglosa la información en jerarquía: metadato de ubicación (gris), monto final estimado en H1 (`$2,450,000`), rango mínimo/máximo en caption, y el respectivo badge de confianza.
4.  **Campos de Formulario (Inputs):**
    *   Etiqueta (label) en Inter 13px gris.
    *   *Estado estándar:* Borde de `1px` gris (`#CBD5E1`), esquinas redondeadas a `8px`, texto de placeholder gris claro.
    *   *Estado activo/foco:* Borde de `2px` azul (`#1E4D8C`), texto introducido en tinta (`#0F172A`).

*Lámina de componentes de referencia:* [lam_componentes.svg](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/guia/lam_componentes.svg) | [Versión PNG](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/png/lam_componentes.png)

---

## 4. Resultados (Evidencias)

Los diagramas visuales detallados que componen esta guía de estilo se encuentran exportados en la carpeta de diseño. Los archivos SVG son directamente importables en Figma o Miro para trabajar sobre el lienzo interactivo:

*   **Manual de Estilo Completo (Láminas de Diseño):**
    *   Lámina 1 - Tipografías: [lam_tipografia.svg](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/guia/lam_tipografia.svg) | [PNG](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/png/lam_tipografia.png)
    *   Lámina 2 - Paleta Cromática: [lam_paleta.svg](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/guia/lam_paleta.svg) | [PNG](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/png/lam_paleta.png)
    *   Lámina 3 - Retícula y Radios: [lam_reticula.svg](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/guia/lam_reticula.svg) | [PNG](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/png/lam_reticula.png)
    *   Lámina 4 - Iconografía de Sistema: [lam_iconografia.svg](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/guia/lam_iconografia.svg) | [PNG](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/png/lam_iconografia.png)
    *   Lámina 5 - Componentes y Tarjetas: [lam_componentes.svg](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/guia/lam_componentes.svg) | [PNG](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/png/lam_componentes.png)
    *   Lámina 6 - Estilo de Fotografía: [lam_imagenes.svg](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/guia/lam_imagenes.svg) | [PNG](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/png/lam_imagenes.png)

*   **Documento Impreso Original:**
    *   Guía de Estilo Oficial (Word): [Guia_de_estilo_Avalia.docx](file:///c:/Users/anton/OneDrive/Desktop/antonio/diseno/Guia_de_estilo_Avalia.docx)

---

## 5. Conclusiones
La estructuración de la **Guía de Estilo de Avalia** provee las bases requeridas para maquetar la interfaz de usuario en React con consistencia matemática y estética. La sincronización entre la paleta del logotipo (Práctica 2.1) y las reglas de diseño (retícula base 8px, fuentes Poppins/Inter y el semáforo semántico) elimina cualquier arbitrariedad visual durante la fase de desarrollo frontend del equipo de programación.
