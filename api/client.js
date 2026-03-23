/**
 * @fileoverview Cliente de API para TaskFlow.
 * Gestiona la comunicación asíncrona con el servidor Node.js.
 */

// Detecta automáticamente si estamos en desarrollo (localhost) o en producción (Vercel)
const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api/v1/tasks'
    : '/api/v1/tasks';

export const apiClient = {
    // 1. Obtener todas las tareas
    getTasks: async () => {
        const res = await fetch(BASE_URL);
        if (!res.ok) throw new Error('Error al cargar las tareas');
        return await res.json();
    },

    // 2. Crear una nueva tarea
    createTask: async (title, category) => {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, category })
        });
        if (!res.ok) throw new Error('Error al crear la tarea');
        return await res.json();
    },

    // 3. Eliminar una tarea
    deleteTask: async (id) => {
        const res = await fetch(`${BASE_URL}/${id}`, { 
            method: 'DELETE' 
        });
        if (!res.ok) throw new Error('Error al eliminar la tarea');
        // No hacemos res.json() porque DELETE devuelve 204 (vacío)
    },

    // 4. Marcar/Desmarcar como completada (Toggle)
    toggleTask: async (id) => {
        const res = await fetch(`${BASE_URL}/${id}/toggle`, { 
            method: 'PATCH' 
        });
        if (!res.ok) throw new Error('Error al cambiar el estado de la tarea');
        return await res.json();
    },

    // 5. Editar el título de una tarea (Ruta: /id/edit)
    editTask: async (id, title) => {
        const res = await fetch(`${BASE_URL}/${id}/edit`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        if (!res.ok) throw new Error('Error al editar la tarea');
        return await res.json();
    }
};