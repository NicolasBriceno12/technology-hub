import express from 'express';
import {
actualizarProducto,
crearProducto,
eliminarProducto,
obtenerProductos
} from '../controllers/productoController.js';
const router = express.Router();
// Rutas existentes
router.get('/', obtenerProductos);
router.post('/', crearProducto);
// Nuevas rutas sin afectar las anteriores
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);
export default router;