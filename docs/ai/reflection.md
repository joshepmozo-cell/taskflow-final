**Reflexión Final sobre IA y Programación**

**Reflexión sobre el Desarrollo con IA: Proyecto TaskFlow**

**Aprendizaje y Metodología**
Lo más impactante de este proceso ha sido la capacidad de las IAs para generar herramientas visuales y benchmarks. Ver el rendimiento en tiempo real con Claude hizo que conceptos abstractos como el Event Loop o el DOM Reflow fueran mucho más fáciles de digerir. Entender la teoría profunda me ha permitido dar instrucciones precisas a la IA para obtener un código de alta calidad, en lugar de recibir respuestas genéricas.

**Tareas donde la IA me ha ayudado más**
La IA ha sido fundamental para acelerar la *Evolución Técnica* y la refactorización de mi código. Inicié con un código funcional pero básico, y mediante el uso de prompts iterativos en Cursor, transformé ese esqueleto en una solución de nivel profesional:
1. ``Optimización:`` Implementación rápida de *DocumentFragment* para reducir el costo de inserciones al DOM.
2. ``Seguridad Proactiva:`` Blindaje de la app contra ataques XSS mediante la generación de código basado en la creación de nodos (*createElement*) y asignación segura (*textContent*).
3. ``Infraestructura:`` Integración asistida de una CSP (Content Security Policy).
4. ``Productividad:`` El uso de *Ctrl + K* en Cursor aplicó estos conceptos directamente sobre el código, ahorrándome horas de investigación manual.

**Casos donde la IA ha fallado o generado código incorrecto**
Durante el desarrollo, noté que la IA no es infalible. Por ejemplo, al intentar implementar el sistema de Drag & Drop, la IA me sugirió inicialmente importar librerías externas pesadas (como SortableJS) en lugar de usar la API nativa de HTML5, lo cual iba en contra del objetivo de mantener el proyecto ligero. Además, en algunas refactorizaciones de la interfaz, el asistente "alucinó" clases de Tailwind CSS que no existían o que rompían el layout responsive, lo que me obligó a revertir los cambios y corregirlos manualmente.

**Riesgos de depender demasiado de la IA**
El mayor riesgo que he identificado es la pérdida de criterio técnico. Si dependemos excesivamente de la IA y nos limitamos a copiar y pegar sin comprender la lógica subyacente, corremos el riesgo de introducir vulnerabilidades de seguridad o deuda técnica en el proyecto. Cuando el código generado falla, si no se tiene una base sólida, la depuración se vuelve prácticamente imposible porque no entiendes el sistema que "tú mismo" has construido.

**Cuándo prefiero programar sin asistencia**
A pesar del enorme valor de estas herramientas, prefiero programar sin asistencia en las siguientes situaciones:
1. ``Lógica de negocio muy específica:`` Cuando las reglas de la aplicación son muy particulares, a veces tardo más en explicarle el contexto a la IA que en escribir el algoritmo yo mismo.
2. ``Micro-ajustes de diseño (CSS/Tailwind):`` Ajustar márgenes, paddings o colores precisos es un proceso muy visual; el ciclo de escribir, guardar y ver el resultado en el navegador es más rápido de forma manual que redactar un prompt para pedir un cambio de 2 píxeles.
3. ``Diseño de la arquitectura inicial:`` Prefiero estructurar las bases, archivos y flujo de datos iniciales por mi cuenta para asegurarme de que tengo un control mental absoluto sobre el mapa del proyecto.

**Conclusión Personal**
La IA no reemplaza al programador, lo potencia. Ha acelerado mi proceso de refactorización al identificar riesgos concretos que a un humano le tomaría mucho más tiempo validar por su cuenta. Sin la base teórica previa, solo estaría copiando código a ciegas; pero combinando mi criterio técnico con la velocidad de la IA, he podido liderar una evolución técnica real en TaskFlow. En cuanto a las herramientas, considero que *ChatGPT* es un excelente tutor para conceptos básicos, *Claude* brilla en la profundidad técnica y validación teórica, y *Cursor* definitivamente ha cambiado mi flujo de trabajo diario.