// backend/routes/cliente.routes.js
import express from 'express';
const router = express.Router();

// Ruta temporal para prueba
router.get('/', (req, res) => {
  res.json({ mensaje: 'Ruta de clientes funcionando correctamente' });
});

export default router;