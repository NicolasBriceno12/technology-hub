import express from 'express';
import { obtenerProductos } from '../controllers/productoController.js';

const router = express.Router();

router.get('/', obtenerProductos); // GET /api/productos

export default router;