import { pool } from '../config/db.js';

// ✅ Obtener todos los productos
export const getProductos = async () => {
  const [rows] = await pool.query('SELECT id_producto, nombre_producto, precio_venta, stock FROM productos');
  return rows;
};

// ✅ Agregar un nuevo producto
export const addProducto = async (producto) => {
  const {
    id_categoria,
    nombre_producto,
    descripcion,
    stock,
    precio_compra,
    precio_venta
  } = producto;

  const sql = `
    INSERT INTO productos (id_categoria, nombre_producto, descripcion, stock, precio_compra, precio_venta)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(sql, [
    id_categoria,
    nombre_producto,
    descripcion,
    stock,
    precio_compra,
    precio_venta
  ]);

  return result;
};

// ✅ Actualizar un producto
export const updateProducto = async (id_producto, producto) => {
  const {
    id_categoria,
    nombre_producto,
    descripcion,
    stock,
    precio_compra,
    precio_venta
  } = producto;

  const sql = `
    UPDATE productos SET
      id_categoria = ?,
      nombre_producto = ?,
      descripcion = ?,
      stock = ?,
      precio_compra = ?,
      precio_venta = ?
    WHERE id_producto = ?
  `;

  const [result] = await pool.query(sql, [
    id_categoria,
    nombre_producto,
    descripcion,
    stock,
    precio_compra,
    precio_venta,
    id_producto
  ]);

  return result.affectedRows;
};

// ✅ Eliminar un producto
export const deleteProducto = async (id_producto) => {
  const [result] = await pool.query('DELETE FROM productos WHERE id_producto = ?', [id_producto]);
  return result.affectedRows;
};