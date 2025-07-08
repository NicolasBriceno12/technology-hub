const express = require('express');
const router = express.Router();
const controller = require('../controllers/productoController');

router.get('/', controller.getAllProductos);
router.post('/', controller.createProducto);
router.put('/:id', controller.updateProducto);
router.delete('/:id', controller.deleteProducto);
router.get('/categorias', controller.getCategorias);

module.exports = router;