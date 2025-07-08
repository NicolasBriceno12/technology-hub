const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);
app.use('/api/productos', require('./routes/productoRoutes'));

// Ruta principal - redirigir al login
app.get('/', (req, res) => {
    res.redirect('/pages/login.html');
});

// Ruta de prueba de la API
app.get('/api/test', (req, res) => {
    res.json({ mensaje: 'API funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const PUERTO = 3000;
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});