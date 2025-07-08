const db = require('../config/db');

// Obtener todos los productos con su categoría
exports.getAllProductos = (req, res) => {
  const sql = `
    SELECT 
  productos.id_producto,
  productos.nombre,
  productos.descripcion,
  productos.precio,
  productos.stock,
  productos.imagen,
  productos.id_categoria,
  categorias.nombre AS categoria
FROM productos
LEFT JOIN categorias ON productos.id_categoria = categorias.id_categoria
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Crear producto
exports.createProducto = (req, res) => {
  const { nombre, descripcion, precio, imagen, stock, id_categoria } = req.body;
  const sql = `
    INSERT INTO productos (nombre, descripcion, precio, imagen, stock, id_categoria)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [nombre, descripcion, precio, imagen, stock || 0, id_categoria], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId });
  });
};

// Editar producto
exports.updateProducto = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, imagen, stock, id_categoria } = req.body;
  const sql = `
    UPDATE productos 
    SET nombre=?, descripcion=?, precio=?, imagen=?, stock=?, id_categoria=?
    WHERE id=?
  `;
  db.query(sql, [nombre, descripcion, precio, imagen, stock, id_categoria, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ mensaje: 'Producto actualizado' });
  });
};

// Eliminar producto
exports.deleteProducto = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM productos WHERE id_producto=?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ mensaje: 'Producto eliminado' });
  });
};

// Obtener categorías
exports.getCategorias = (req, res) => {
  const sql = 'SELECT id_categoria AS id, nombre AS nombre FROM categorias';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
