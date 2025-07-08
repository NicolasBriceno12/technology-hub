const express = require('express');
const router = express.Router();
const controller = require('../controllers/gestionVentaController');

router.get('/', controller.obtenerVentas);
router.put('/:id', controller.actualizarVenta);
router.post('/', controller.agregarVenta); // (opcional si usas agregar)
router.delete('/:id', controller.eliminarVenta); // (opcional si usas eliminar)

module.exports = router;