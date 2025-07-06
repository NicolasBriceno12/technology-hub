const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', authRoutes);

// Ruta raíz opcional
app.get('/', (req, res) => {
  res.send('✅ Servidor backend de TechnologyHub funcionando. Usa /api/login o /api/register');
});

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutando en http://localhost:${PORT}`);
});