**Prompt Engineering**

En este documento registro los prompts más efectivos que he utilizado durante el desarrollo del proyecto TaskFlow, aplicando diferentes técnicas de ingeniería de prompts (roles, few-shot, step-by-step y restricciones).

**1. Optimización del Renderizado (Uso de Restricciones)**
``Fecha:`` 19 de Marzo, 2026
``Archivo:`` *app.js*
``IA utilizada:`` Cursor (Modelo interno)

**Prompt enviado:**
Refactoriza esta función *renderizar* para que use un *DocumentFragment*. Crea el fragmento al inicio, añade todos los *article* al fragmento dentro del bucle, y haz un solo *appendChild* al final al *contenedor*. Restricción: Mantén las clases de Tailwind y los eventos *onclick* tal cual están, no modifiques la lógica de negocio.

**Resultado y Explicación:**
Este prompt funcionó excelente porque establece una restricción clara ("no modifiques la lógica"). Se logró reducir los reflows del navegador a un solo impacto por cada actualización. La IA respetó los "template literals" y los eventos de *borrar*, asegurando la estabilidad.

**2. Mejora de UX: Estado Vacío (Restricciones y Estilo)**
``Fecha:``17 de Marzo, 2026
``Archivo modificado:`` *app.js*
``IA utilizada:`` Cursor (Modelo interno)

**Prompt enviado:**
Modifica la función *renderizar* para que, si el array de *tareas* está vacío, inserte en el *contenedor* un mensaje que diga: '¡Lista vacía! Añade tu primer hábito para empezar 🚀' con clases de Tailwind exactas: texto centrado, color gris suave (*text-slate-400*), fuente mediana y un margen superior (*mt-10*). No olvides mantener el *DocumentFragment*.

**Resultado y Explicación:**
Dar instrucciones exactas de clases CSS a la IA evita que alucine diseños incompatibles con el proyecto. La aplicación ahora maneja elegantemente la falta de datos sin romper la interfaz gráfica.

**3. Implementación de Accesibilidad (Asignación de Rol y Paso a Paso)**
``IA utilizada:`` Claude 3.5 Sonnet

**Prompt enviado:**
Actúa como un desarrollador senior experto en accesibilidad web (a11y). Revisa mi archivo *index.html* paso a paso e indícame dónde debo agregar atributos *aria-label* para que los lectores de pantalla puedan interpretar correctamente los botones de iconografía y controles de estado.

**Resultado y Explicación:**
Asignar un rol de experto obliga al modelo a priorizar estándares (WCAG). El modelo no solo me dio el código, sino que razonó paso a paso la necesidad de los *aria-label* en los checkboxes y en el botón de cambiar tema.

## 4. Configuración de Categorías (Few-Shot Prompting)
``IA utilizada:`` ChatGPT

**Prompt enviado:**
Necesito crear un objeto de colores para las categorías de mis tareas usando clases de Tailwind. Aquí tienes un ejemplo de lo que busco: 
> `Personal: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'`
Siguiendo exactamente esta misma estructura y contraste (fondo claro, texto oscuro, versiones dark equivalentes), genera tres categorías más: Trabajo, Salud y Hogar.

**Resultado y Explicación:**
La técnica *few-shot prompting* (proveer un ejemplo) es la más efectiva para mantener coherencia de diseño. La IA replicó el patrón exacto utilizando azul, verde y naranja, garantizando uniformidad visual en TaskFlow.

**5. Refactorización del Modo Oscuro (Razonamiento Paso a Paso)**
``IA utilizada:`` Cursor (Modelo interno)

**Prompt enviado:**
Refactoriza la función del botón que alterna el modo oscuro. Razona paso a paso cómo comprobar si la clase 'dark' existe en el elemento raíz del documento, cómo alternarla sin fallos, y finalmente cómo guardar la preferencia exacta ('dark' o 'light') en LocalStorage.

**Resultado y Explicación:**
Pedir que razone paso a paso (*Chain of Thought*) evitó los típicos bugs donde la clase de Tailwind se desincroniza del LocalStorage. La IA generó un código basado en *classList.contains* que resultó 100% estable.

**6. Generación de Función Segura (Uso de Restricciones)**
``IA utilizada:`` ChatGPT

**Prompt enviado:**
Escribe la función *agregarTarea()* para insertar elementos en el array *listaTareas*. Restricciones técnicas obligatorias: 1) Utiliza *crypto.randomUUID()* para el ID. 2) Utiliza *.trim()* para limpiar el input. 3) Si el texto está vacío o supera los 120 caracteres, interrumpe la ejecución silenciosamente con un *return*.

**Resultado y Explicación:**
Imponer restricciones técnicas estrictas previene que el asistente sugiera malas prácticas (como usar `Math.random` para IDs o ignorar validaciones). El código generado fue seguro y listo para producción.

**7. Documentación Profesional (Asignación de Rol)**
``IA utilizada:`` Cursor (Modelo interno)

**Prompt enviado**
Actúa como un Technical Writer especializado en JavaScript. Escribe los comentarios en formato JSDoc para la función *reordenarTareasArray(idOrigen, idDestino)*. Define claramente los parámetros y advierte que la función no debe mutar el estado si el filtro activo es distinto de 'todas'.

**Resultado y Explicación:**
El enfoque de rol produjo una documentación de código limpia y estandarizada, ideal para facilitar el mantenimiento futuro de la aplicación y cumplir con métricas de calidad de código.

**8. Creación de Drag & Drop (Restricciones Severas)**
``IA utilizada:`` Claude 3.5 Sonnet

**Prompt enviado:**
Necesito la lógica para implementar Drag & Drop en mis tarjetas de tareas. Condición excluyente: Debes usar los eventos nativos de HTML5 (*dragstart*, *dragover*, *drop*) y está absolutamente prohibido utilizar librerías externas o dependencias.

**Resultado y Explicación:**
Dado que el Drag & Drop es complejo, las IAs tienden a recomendar librerías de terceros (como SortableJS). Esta restricción severa garantizó que la aplicación se mantuviera ligera y sin dependencias.

**9. Solución de Bugs en Filtros (Razonamiento Paso a Paso)**
``IA utilizada:`` ChatGPT

**Prompt enviado:**
Tengo un bug: al hacer clic en un botón de filtro ('Todas', 'Pendientes', 'Completadas'), este no mantiene su color activo y los demás no regresan al color inactivo. Analiza la lógica paso a paso y sugiere una corrección iterando sobre los IDs para resetear los estilos antes de aplicar el estilo activo.

**Resultado y Explicación:**
Explicar el bug y orientar el razonamiento hizo que la IA entregara una función *establecerFiltro* sólida, que resetea las clases *bg-slate-200* y aplica *bg-[#203B53]* al elemento correcto de forma dinámica.

**10. Mejora del Código y Cálculos (Asignación de Rol)**
``IA utilizada:`` Cursor (Modelo interno)

**Prompt enviado:**
Actúa como un desarrollador senior experto en Clean Code. Analiza mi función `actualizarEstadisticas()`. Simplifica el cálculo de tareas completadas utilizando métodos funcionales de arrays (`.filter()`) y optimiza la actualización del DOM para que sea más legible.

**Resultado y Explicación:**
La IA transformó bucles largos en funciones declarativas (*listaTareas.filter(t => t.completada).length*), mejorando la legibilidad del código y demostrando la capacidad de la IA para elevar la calidad de un proyecto a estándares senior.