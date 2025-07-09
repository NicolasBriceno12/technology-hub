const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/img/uploads', express.static(path.resolve(__dirname, '../frontend/img/imagenes/uploads')));

// Rutas importadas con verificación
try {
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('✅ authRoutes cargado');
} catch (err) {
  console.error('❌ Error cargando authRoutes:', err.message);
}

try {
  const clienteRoutes = require('./routes/clienteRoutes');
  app.use('/api/clientes', clienteRoutes);
  console.log('✅ clienteRoutes cargado');
} catch (err) {
  console.error('❌ Error cargando clienteRoutes:', err.message);
}

try {
  const pqrsRoutes = require('./routes/pqrsRoutes');
  app.use('/api/pqrs', pqrsRoutes);
  console.log('✅ pqrsRoutes cargado');
} catch (err) {
  console.error('❌ Error cargando pqrsRoutes:', err.message);
}

try {
  const productoRoutes = require('./routes/productoRoutes');
  app.use('/api/productos', productoRoutes);
  console.log('✅ productoRoutes cargado');
} catch (err) {
  console.error('❌ Error cargando productoRoutes:', err.message);
}

try {
  const rolesRoutes = require('./routes/rolesRoutes');
  app.use('/api/roles', rolesRoutes);
  console.log('✅ rolesRoutes cargado');
} catch (err) {
  console.error('❌ Error cargando rolesRoutes:', err.message);
}

try {
  const usuarioRoutes = require('./routes/usuarioRoutes');
  app.use('/api/usuarios', usuarioRoutes);
  console.log('✅ usuarioRoutes cargado');
} catch (err) {
  console.error('❌ Error cargando usuarioRoutes:', err.message);
}

try {
  const gestionVentasRoutes = require('./routes/gestionVentasRoutes');
  app.use('/api/gestion_ventas', gestionVentasRoutes);
  console.log('✅ gestionVentasRoutes cargado');
} catch (err) {
  console.error('❌ Error cargando gestionVentasRoutes:', err.message);
}

app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});