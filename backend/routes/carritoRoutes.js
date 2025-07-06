import express from 'express';
import * as carritoController from '../controllers/carritoController.js';

const router = express.Router();

// Agregar producto al carrito
router.post('/agregar', carritoController.agregarAlCarrito);

// Obtener carrito del usuario
router.get('/:id_usuario', carritoController.obtenerCarrito);

// Actualizar cantidad de producto en carrito
router.put('/actualizar', carritoController.actualizarCantidad);

// Eliminar producto del carrito
router.delete('/:id_carrito', carritoController.eliminarDelCarrito);

// Limpiar carrito completo
router.delete('/limpiar/:id_usuario', carritoController.limpiarCarrito);

export default router;