const db = require('../config/db');

// Obtener todos los productos con su categoría
exports.getAllProductos = async (req, res) => {
  const sql = `
    SELECT 
      productos.id_producto AS id,
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
  try {
    const [productos] = await db.query(sql);
    res.json(productos);
  } catch (err) {
    console.error('❌ Error al obtener productos:', err.message);
    res.status(500).json({ error: err });
  }
};

// Crear producto
exports.createProducto = async (req, res) => {
  const { nombre, descripcion, precio, imagen, stock, id_categoria } = req.body;
  const sql = `
    INSERT INTO productos (nombre, descripcion, precio, imagen, stock, id_categoria)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    const [result] = await db.query(sql, [nombre, descripcion, precio, imagen, stock || 0, id_categoria]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('❌ Error al crear producto:', err.message);
    res.status(500).json({ error: err });
  }
};

// Editar producto
exports.updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, imagen, stock, id_categoria } = req.body;
  const sql = `
    UPDATE productos 
    SET nombre=?, descripcion=?, precio=?, imagen=?, stock=?, id_categoria=?
    WHERE id_producto=?
  `;
  try {
    await db.query(sql, [nombre, descripcion, precio, imagen, stock, id_categoria, id]);
    res.json({ mensaje: 'Producto actualizado' });
  } catch (err) {
    console.error('❌ Error al actualizar producto:', err.message);
    res.status(500).json({ error: err });
  }
};

// Eliminar producto
exports.deleteProducto = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM productos WHERE id_producto=?', [id]);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    console.error('❌ Error al eliminar producto:', err.message);
    res.status(500).json({ error: err });
  }
};

// Obtener categorías
exports.getCategorias = async (req, res) => {
  try {
    const [categorias] = await db.query('SELECT id_categoria AS id, nombre AS nombre FROM categorias');
    res.json(categorias);
  } catch (err) {
    console.error('❌ Error al obtener categorías:', err.message);
    res.status(500).json({ error: err });
  }
};
