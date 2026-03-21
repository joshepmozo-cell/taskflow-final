**Experimentos de Programación con IA**

En este documento se registran los resultados de resolver problemas de programación utilizando dos enfoques diferentes: desarrollo manual tradicional vs. desarrollo asistido por IA.

**1. Problemas de Programación Generales**

### Problema A: Formatear fechas relativas (ej. "hace 2 días")
- ``Desarrollo Manual:`` Tiempo estimado de 25 minutos. Requirió calcular diferencias en milisegundos, gestionar conversiones matemáticas y manejar múltiples rangos (horas, días, meses) mediante bloques condicionales extensos.
- ``Asistido por IA:`` Tiempo invertido de 3 minutos. La IA generó una función utilizando la API nativa *Intl.RelativeTimeFormat*, una solución mucho más eficiente, moderna y con soporte de internacionalización integrado.
- ``Conclusión:`` La IA optimiza la sintaxis y sugiere patrones o APIs nativas modernas que el desarrollador puede desconocer, mejorando la calidad del código final.

### Problema B: Filtrado avanzado de arrays de objetos
- ``Desarrollo Manual:`` 15 minutos. Se implementó usando métodos *.filter()* combinados con múltiples operadores lógicos. Funcional, pero difícil de escalar.
- ``Asistido por IA:`` 2 minutos. Sugirió un enfoque de filtrado dinámico basado en un diccionario de predicados.
- ``Conclusión:`` Reduce el tiempo de implementación de algoritmos estándar, permitiendo enfocar el esfuerzo en la lógica de negocio.

**2. Tareas Relacionadas con TaskFlow**

**Implementación del sistema Drag & Drop**
- ``Desarrollo Manual:`` Alta complejidad temporal (estimado en +2 horas). Requiere gestionar eventos del navegador (*dragstart*, *dragover*, *dragleave*, *drop*), manipular clases CSS dinámicamente para dar feedback visual y reordenar el array de datos sin perder la sincronización.
- ``Asistido por IA:`` Tiempo invertido de 15 minutos. La IA generó la estructura base de los eventos y la lógica de reordenamiento de forma precisa mediante el método *splice*.
- ``Conclusión:`` En tareas de manipulación compleja del DOM, la IA acelera drásticamente la construcción de la estructura inicial. Sin embargo, requiere una supervisión rigurosa para garantizar que la actualización del estado (como guardar en LocalStorage) se mantenga libre de errores y sin parpadeos visuales en el renderizado.