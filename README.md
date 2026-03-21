**TaskFlow**

**Mis Hábitos Diarios: Toma el control de tu día a día.**

TaskFlow es una aplicación web que he diseñado y desarrollado para gestionar tareas y hábitos diarios. Mi objetivo principal fue crear una herramienta funcional y enfocada en el uso diario, con una interfaz intuitiva y un diseño limpio y elegante.

**Enlace del proyecto en vivo:** https://taskflow-final-henna.vercel.app/


**Ejemplos de Uso**
Para sacar el máximo provecho a la aplicación que he construido, prueba las siguientes interacciones:
1. ``Crear con categoría:`` Escribe "Correr 5 km", selecciona la etiqueta "Salud 🍎" en el menú desplegable y pulsa "Añadir".
2. ``Edición rápida:`` Haz doble clic sobre el texto de cualquier tarea pendiente. El texto se convertirá en un input; modifícalo y presiona *Enter* para guardar.
3. ``Reordenar (Drag & Drop):`` Haz clic sostenido sobre el icono *☰* a la izquierda de una tarea y arrástrala hacia arriba o abajo para priorizarla a tu gusto.
4. ``Celebración:`` Al marcar la última tarea pendiente de tu lista, el sistema lanzará una animación de confeti y mostrará un mensaje de "Día perfecto".

---

**Diseño e Interfaz**
He desarrollado la interfaz buscando un acabado profesional, cuidando la armonía visual y la experiencia del usuario.

- ``Modo Oscuro:`` Incluí un control dedicado para alternar entre el modo claro y oscuro. La paleta de colores la adapté dinámicamente para garantizar la legibilidad en cualquier entorno.
- ``Categorías Prácticas:`` En lugar de usar prioridades genéricas (alta/baja), implementé etiquetas adaptadas a la rutina diaria: Trabajo , Salud , Personal y Hogar . Cada categoría cuenta con su propio identificador de color.
- ``Panel de Estadísticas:`` Creé un panel lateral que muestra el progreso en tiempo real, detallando las tareas totales, completadas y pendientes para mantener la motivación.

---

**Tecnologías Utilizadas**
- ``Estructura y Estilos:`` HTML5 semántico y *Tailwind CSS* para lograr un diseño completamente responsivo (adaptable a dispositivos móviles y escritorio).
- ``Lógica:`` JavaScript Moderno (ES6+) para la manipulación del DOM y la interactividad.
- ``Persistencia de Datos:`` Integré la API de *LocalStorage* para asegurar que las tareas, el orden y las preferencias de tema se conserven al recargar la página.


**Funcionalidades Avanzadas (Bonus)**
He incluido características extra para llevar el proyecto al siguiente nivel técnico y visual:
- ``Drag & Drop:`` Programé un sistema avanzado para arrastrar y soltar las tareas, permitiendo reordenarlas libremente.
- ``Efectos Visuales:`` Añadí animaciones suaves al interactuar con la lista y un efecto de confeti nativo al completar tareas.
- ``Buscador Independiente:`` Desarrollé una barra de búsqueda que filtra los hábitos en tiempo real sin interferir con el campo de creación.


**Documentación de Inteligencia Artificial**
Para este proyecto, integré herramientas de IA en mi flujo de desarrollo. He documentado mis prompts, refactorizaciones, experimentos y aprendizajes personales. Todo este proceso se encuentra detallado en la carpeta */docs/ai* de mi repositorio.


**Pruebas Manuales y Control de Calidad**
He realizado pruebas exhaustivas para garantizar la estabilidad de mi código:
- [x] ``Prevención de errores:`` Configuré el formulario para bloquear la creación de tareas vacías o compuestas únicamente por espacios.
- [x] ``Estabilidad visual:`` Apliqué reglas CSS (*word-break*) para evitar que títulos extremadamente largos rompan la estructura de las tarjetas.
- [x]``Acciones globales:`` Verifiqué el correcto funcionamiento de los botones "Completar Todas" y "Limpiar", asegurando la actualización inmediata de los contadores.
- [x] ``Persistencia de datos:`` Comprobé que el estado de las tareas, su orden (Drag & Drop) y el tema (claro/oscuro) sobreviven a las recargas del navegador.
- [x] ``Diseño Responsivo:`` Testeado en múltiples tamaños de pantalla.
- [x] ``Accesibilidad:`` Implementé atributos *aria-label* en controles interactivos para facilitar la navegación mediante lectores de pantalla.

*Desarrollado por: Josepd David Mozo Almachi 