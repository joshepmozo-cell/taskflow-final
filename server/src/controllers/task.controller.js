const taskService = require('../services/task.service');

const taskController = {
    // Obtener todas las tareas
    obtenerTodas: (req, res) => {
        res.json(taskService.obtenerTodas());
    },
    
    // Crear una nueva tarea
    crearTarea: (req, res) => {
        const { title, category } = req.body;
        
        // Validación defensiva: El título no puede estar vacío
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: "El título es requerido" });
        }
        
        const nueva = taskService.crearTarea({ title, category });
        res.status(201).json(nueva);
    },

    // Marcar o desmarcar una tarea como completada
    toggleTarea: (req, res, next) => {
        try {
            const actualizada = taskService.toggleTarea(req.params.id);
            res.json(actualizada);
        } catch (e) { 
            next(e); // Si falla (ej. NOT_FOUND), lo pasa al middleware global de errores
        }
    },

    // Editar el texto de una tarea
    editarTarea: (req, res, next) => {
        try {
            const { title } = req.body;
            
            // Validación defensiva para la edición
            if (!title || title.trim() === '') {
                return res.status(400).json({ error: "El nuevo título no puede estar vacío" });
            }
            
            // Le pasamos solo el 'title' (string) al servicio
            const actualizada = taskService.editarTarea(req.params.id, title);
            res.json(actualizada);
        } catch (e) { 
            next(e); 
        }
    },

    // Eliminar una tarea
    eliminarTarea: (req, res, next) => {
        try {
            taskService.eliminarTarea(req.params.id);
            res.status(204).send(); 
        } catch (e) { 
            next(e); 
        }
    }
};

module.exports = taskController;