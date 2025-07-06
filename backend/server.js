import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import clienteRoutes from './routes/cliente.routes.js';
import pqrsRoutes from './routes/pqrsRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import rolesRoutes from './routes/rolesRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import ventaRoutes from './routes/ventasRoutes.js';
const app = express();
app.use(cors());
app.use(express.json());
// Para obtener __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Servir archivos estáticos desde el frontend
app.use(express.static(path.join(__dirname, '../frontend')));
// Montar las rutas de autenticación
app.use('/api', authRoutes); // <-- Añadido
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/pqrs', pqrsRoutes);
app.use('/api/clientes', clienteRoutes);
// Ruta raíz que sirve login.html por defecto
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, '../frontend/login.html'));
});
app.listen(3000, () => {
console.log('Servidor corriendo en http://localhost:3000');
});

// import clienteRoutes from './routes/cliente.routes.js';
// app.use('/api/clientes', clienteRoutes);
// Servir frontend estático
app.use(express.static(path.join(__dirname, '../frontend')));
