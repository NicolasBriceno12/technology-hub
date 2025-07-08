const pool = require('../config/db');

const GestionVenta = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM gestion_ventas');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM gestion_ventas WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (venta) => {
    const { id_venta, descripcion, estado } = venta;
    const [result] = await pool.query('INSERT INTO gestion_ventas (id_venta, descripcion, estado) VALUES (?, ?, ?)', [id_venta, descripcion, estado]);
    return result.insertId;
  },

  update: async (id, nuevaVenta) => {
    const ventaActual = await GestionVenta.getById(id);
    if (!ventaActual) return null;

    const { id_venta, descripcion, estado } = nuevaVenta;

    const updated = {
      id_venta: id_venta || ventaActual.id_venta,
      descripcion: descripcion || ventaActual.descripcion,
      estado: estado || ventaActual.estado,
    };

    await pool.query(`
      UPDATE gestion_ventas SET id_venta = ?, descripcion = ?, estado = ? WHERE id = ?
    `, [updated.id_venta, updated.descripcion, updated.estado, id]);

    return true;
  },

  delete: async (id) => {
    await pool.query('DELETE FROM gestion_ventas WHERE id = ?', [id]);
  }
};

module.exports = GestionVenta;