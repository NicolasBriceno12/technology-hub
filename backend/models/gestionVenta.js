const pool = require('../config/db');

const GestionVenta = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT id, id_venta, descripcion, estado FROM gestion_ventas');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query('SELECT id, id_venta, descripcion, estado FROM gestion_ventas WHERE id = ?', [id]);
    return rows[0];
  },

  create: async ({ id_venta, descripcion, estado }) => {
    const [result] = await pool.query(
      'INSERT INTO gestion_ventas (id_venta, descripcion, estado) VALUES (?, ?, ?)',
      [id_venta, descripcion, estado]
    );
    return result.insertId;
  },

  update: async (id, { descripcion, estado }) => {
    const ventaActual = await GestionVenta.getById(id);
    if (!ventaActual) return null;

    const nuevaDescripcion = descripcion || ventaActual.descripcion;
    const nuevoEstado = estado || ventaActual.estado;

    await pool.query(
      'UPDATE gestion_ventas SET descripcion = ?, estado = ? WHERE id = ?',
      [nuevaDescripcion, nuevoEstado, id]
    );

    return true;
  }
};

module.exports = GestionVenta;
