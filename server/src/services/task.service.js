// Array en memoria que actúa como nuestra "Base de Datos" temporal
let tasks = [];

const taskService = {
    // 1. Obtener todas las tareas
    obtenerTodas: () => tasks,
    
    // 2. Crear una nueva tarea
    crearTarea: ({ title, category }) => {
        const nueva = {
            id: Date.now().toString(),
            title,
            category: category || 'Personal',
            completed: false,
            createdAt: new Date()
        };
        tasks.push(nueva);
        return nueva;
    },

    // 3. Marcar o desmarcar como completada
    toggleTarea: (id) => {
        const task = tasks.find(t => t.id === id);
        if (!task) throw new Error('NOT_FOUND');
        
        task.completed = !task.completed;
        return task;
    },

    // 4. Eliminar una tarea de la lista
    eliminarTarea: (id) => {
        const index = tasks.findIndex(t => t.id === id);
        if (index === -1) throw new Error('NOT_FOUND');
        
        tasks.splice(index, 1);
        return true;
    },

    // 5. Editar el título de una tarea
    editarTarea: (id, newTitle) => {
        const task = tasks.find(t => t.id === id);
        if (!task) throw new Error('NOT_FOUND');
        
        if (newTitle) task.title = newTitle;
        return task;
    }
};

module.exports = taskService;