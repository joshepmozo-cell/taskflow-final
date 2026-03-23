const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

router.get('/', taskController.obtenerTodas);
router.post('/', taskController.crearTarea);
router.patch('/:id/toggle', taskController.toggleTarea);
router.patch('/:id/edit', taskController.editarTarea); // <-- Ajustado para coincidir con el cliente
router.delete('/:id', taskController.eliminarTarea);

module.exports = router;