const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const taskRoutes = require('./routes/task.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/v1/tasks', taskRoutes);

app.get('/', (req, res) => res.send('¡Backend de TaskFlow funcionando! 🚀'));

app.listen(PORT, () => {
    console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});