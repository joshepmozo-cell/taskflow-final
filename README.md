# TaskFlow — Mis Hábitos Diarios

**Toma el control de tu día a día.**

TaskFlow es una aplicación web full-stack para gestionar tareas y hábitos diarios. Cuenta con un frontend interactivo construido con JavaScript vanilla y Tailwind CSS, y un backend REST desarrollado con Node.js y Express que sirve como capa de persistencia y lógica de negocio.

**🌐 Proyecto en vivo:** https://taskflow-final-henna.vercel.app/

---

## Arquitectura del Proyecto

```
taskflow-final/
├── api/
│   └── client.js              # Capa de red del frontend (fetch al backend)
├── docs/
│   ├── ai/                    # Documentación del proceso con IA
│   │   ├── ai-comparison.md
│   │   ├── cursor-workflow.md
│   │   ├── experiments.md
│   │   ├── prompt-engineering.md
│   │   └── reflection.md
│   └── backend-api.md         # Documentación de herramientas: Axios, Postman, Sentry, Swagger
├── server/
│   └── src/
│       ├── config/
│       │   └── env.js         # Variables de entorno y configuración
│       ├── controllers/
│       │   └── task.controller.js  # Orquestación de peticiones HTTP
│       ├── routes/
│       │   └── task.routes.js      # Mapeo de verbos HTTP a controladores
│       ├── services/
│       │   └── task.service.js     # Lógica de negocio pura
│       └── index.js           # Punto de entrada del servidor Express
├── app.js                     # Lógica principal del frontend
├── index.html                 # Estructura HTML
├── style.css                  # Estilos y animaciones
├── tailwind-config.js         # Configuración de Tailwind CSS
└── vercel.json                # Configuración de despliegue en Vercel
```

---

## Backend — Arquitectura por Capas

El servidor sigue el patrón de **separación de responsabilidades** dividido en tres capas estrictas y unidireccionales. Cada capa tiene una única misión y no conoce los detalles de las demás.

### Capa 1 — Rutas (`task.routes.js`)

Su única misión es escuchar la red y mapear cada verbo HTTP al controlador correspondiente. No toma ninguna decisión lógica.

```
GET    /api/v1/tasks           → obtenerTodas
POST   /api/v1/tasks           → crearTarea
PATCH  /api/v1/tasks/:id/toggle → toggleTarea
PATCH  /api/v1/tasks/:id/edit  → editarTarea
DELETE /api/v1/tasks/:id       → eliminarTarea
```

### Capa 2 — Controladores (`task.controller.js`)

Actúan como directores de orquesta. Extraen los datos de `req.body` o `req.params`, aplican **validaciones defensivas** y delegan la lógica real al servicio. Devuelven los códigos HTTP semánticamente correctos.

| Acción | Código de éxito | Código de error |
|--------|----------------|-----------------|
| Obtener todas | `200 OK` | — |
| Crear tarea | `201 Created` | `400` si el título está vacío |
| Toggle / Editar | `200 OK` | `404` si el ID no existe |
| Eliminar | `204 No Content` | `404` si el ID no existe |

Ejemplo de validación defensiva en el controlador:

```javascript
crearTarea: (req, res) => {
    const { title, category } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ error: "El título es requerido" });
    }

    const nueva = taskService.crearTarea({ title, category });
    res.status(201).json(nueva);
}
```

### Capa 3 — Servicios (`task.service.js`)

Es el corazón intelectual de la aplicación. Contiene la **lógica de negocio pura** y es completamente independiente de Express, HTTP, `req` o `res`. Utiliza un array en memoria como persistencia temporal.

Cuando se solicita una operación sobre un ID inexistente, el servicio lanza un error estándar de JavaScript que el controlador captura y pasa al middleware global:

```javascript
toggleTarea: (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('NOT_FOUND');
    task.completed = !task.completed;
    return task;
}
```

---

## Middlewares

El servidor aplica el patrón de **cadena de responsabilidad**: cada petición HTTP atraviesa una serie de middlewares antes de llegar al controlador.

### `cors()`
Gestiona las cabeceras de Cross-Origin Resource Sharing. Permite que el frontend (servido desde Vercel o `localhost`) pueda consumir la API sin que el navegador bloquee las peticiones por política de mismo origen.

```javascript
app.use(cors());
```

### `express.json()`
Intercepta el flujo de datos crudo de la red y transforma el body de la petición en un objeto JavaScript accesible en `req.body`. Sin este middleware, el body de los `POST` y `PATCH` llegaría como texto plano sin parsear.

```javascript
app.use(express.json());
```

### Middleware global de errores (4 parámetros)
Es el último eslabón de la cadena. Captura cualquier error lanzado desde los servicios mediante `next(e)`. Evalúa el tipo de error para devolver el código HTTP semánticamente correcto, garantizando que nunca se filtren detalles técnicos internos al cliente.

```javascript
app.use((err, req, res, next) => {
    if (err.message === 'NOT_FOUND') {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
});
```

---

## API REST — Referencia de Endpoints

**Base URL:** `http://localhost:3000/api/v1`

### `GET /tasks`
Devuelve todas las tareas almacenadas en memoria.

**Respuesta exitosa (`200 OK`):**
```json
[
  {
    "id": "1711234567890",
    "title": "Correr 5 km",
    "category": "Salud",
    "completed": false,
    "createdAt": "2026-03-25T10:00:00.000Z"
  }
]
```

### `POST /tasks`
Crea una nueva tarea. El campo `title` es obligatorio.

**Body requerido:**
```json
{ "title": "Correr 5 km", "category": "Salud" }
```

**Respuesta exitosa (`201 Created`):**
```json
{
  "id": "1711234567890",
  "title": "Correr 5 km",
  "category": "Salud",
  "completed": false,
  "createdAt": "2026-03-25T10:00:00.000Z"
}
```

**Error (`400 Bad Request`)** — si `title` está vacío:
```json
{ "error": "El título es requerido" }
```

### `PATCH /tasks/:id/toggle`
Alterna el estado `completed` de una tarea entre `true` y `false`.

**Error (`404 Not Found`)** — si el ID no existe:
```json
{ "error": "Tarea no encontrada" }
```

### `PATCH /tasks/:id/edit`
Edita el título de una tarea existente.

**Body requerido:**
```json
{ "title": "Nuevo título de la tarea" }
```

### `DELETE /tasks/:id`
Elimina una tarea. Devuelve `204 No Content` sin cuerpo en caso de éxito.

**Error (`404 Not Found`)** — si el ID no existe:
```json
{ "error": "Tarea no encontrada" }
```

---

## Frontend — Gestión de Estados de Red

El frontend consume la API a través de `api/client.js`, una capa de red dedicada que centraliza todas las llamadas `fetch`. La interfaz gestiona tres estados para cada operación:

- **Carga** → muestra "⏳ Sincronizando..." en el contenedor de estado
- **Éxito** → renderiza las tareas actualizadas
- **Error** → muestra "❌ Error de conexión" con feedback visual

```javascript
async function loadTasks() {
    uiStateContainer.innerHTML = '<span class="text-blue-500 animate-pulse">⏳ Sincronizando...</span>';
    try {
        listaTareas = await apiClient.getTasks();
        renderizarTareas();
        uiStateContainer.innerHTML = '';
    } catch (error) {
        uiStateContainer.innerHTML = '<span class="text-red-500">❌ Error de conexión</span>';
    }
}
```

---

## Puesta en marcha local

### Requisitos
- Node.js v18 o superior

### 1. Instalar dependencias del servidor
```bash
cd server
npm install
```

### 2. Crear el archivo de variables de entorno
```bash
# Crear el archivo .env en /server
echo "PORT=3000" > .env
```

### 3. Arrancar el servidor en modo desarrollo
```bash
npm run dev
# El servidor queda escuchando en http://localhost:3000
```

### 4. Abrir el frontend
Abre `index.html` directamente en el navegador o usa Live Server desde VS Code.

---

## Funcionalidades

- **Crear tareas** con categoría (Personal, Trabajo, Salud, Hogar)
- **Marcar como completadas** con animación de confeti al completar la última
- **Edición inline** con doble clic sobre el texto de cualquier tarea
- **Eliminar tareas** individualmente o limpiar todas las completadas
- **Filtros** por estado: Todas, Pendientes, Completadas
- **Buscador en tiempo real** independiente de los filtros
- **Drag & Drop** nativo (HTML5) para reordenar tareas
- **Modo oscuro/claro** con preferencia guardada en localStorage
- **Panel de estadísticas** con conteo en tiempo real
- **Diseño responsivo** adaptado a móvil y escritorio

---

## Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5, JavaScript ES6+, Tailwind CSS |
| Backend | Node.js, Express.js |
| Configuración | dotenv |
| Seguridad CORS | cors |
| Despliegue | Vercel |
