import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import pqrsRoutes from './routes/pqrsRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import rolesRoutes from './routes/rolesRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import ventaRoutes from './routes/ventasRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Para obtener __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Rutas API
app.use('/api', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes); // ✅ deja solo esta
app.use('/api/ventas', ventaRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/pqrs', pqrsRoutes);
app.use('/api/clientes', clienteRoutes);

// ✅ Ruta raíz sirve el HTML de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// ✅ Ruta para páginas internas (por si navegas por otras .html)
app.get('/:page', (req, res) => {
  res.sendFile(path.join(__dirname, `../frontend/${req.params.page}`));
});

// ✅ Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});