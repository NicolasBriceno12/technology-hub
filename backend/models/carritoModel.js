import { pool } from '../config/db.js';

export const agregarAlCarrito = async ({ id_usuario, id_producto, cantidad, precio }) => {
  const [result] = await pool.query(
    'INSERT INTO carrito (id_usuario, id_producto, cantidad, precio) VALUES (?, ?, ?, ?)',
    [id_usuario, id_producto, cantidad, precio]
  );
  return result.insertId;
};

export const obtenerCarritoPorUsuario = async (id_usuario) => {
  const [rows] = await pool.query(
    `SELECT c.*, p.nombre_producto
     FROM carrito c
     JOIN productos p ON c.id_producto = p.id_producto
     WHERE c.id_usuarios = ?`,
    [id_usuario]
  );
  return rows;
};

export const eliminarDelCarrito = async (id) => {
  await pool.query('DELETE FROM carrito WHERE id = ?', [id]);
};

export const vaciarCarrito = async (id_usuario) => {
  await pool.query('DELETE FROM carrito WHERE id_usuarios = ?', [id_usuario]);
};