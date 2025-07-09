const express = require('express');
const router = express.Router();
const controller = require('../controllers/productoController');
const multer = require('multer');
const path = require('path');

// Configurar almacenamiento de multer
const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '../../frontend/img/imagenes/uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Rutas
router.get('/', controller.getAllProductos);
router.get('/categorias', controller.getCategorias);
router.post('/', upload.single('imagen'), controller.createProducto);
router.put('/:id', controller.updateProducto);
router.delete('/:id', controller.deleteProducto);

module.exports = router;