// backend/models/productoModel.js
import { pool } from '../config/db.js';
export const getProductos = async () => {
const [rows] = await pool.query('SELECT * FROM productos');
return rows;
};
export const addProducto = async (producto) => {
const [result] = await pool.query('INSERT INTO productos SET ?',
[producto]);
return result;
};
export const updateProducto = async (id, producto) => {
const { nombre_prod, stock, precio } = producto;
const [result] = await pool.query('UPDATE productos SET nombre_prod = ?,
stock = ?, precio = ? WHERE id = ?', [nombre_prod, stock, precio, id]);
return result.affectedRows;
};
export const deleteProducto = async (id) => {
const [result] = await pool.query('DELETE FROM productos WHERE id = ?',
[id]);
return result.affectedRows;
};
