export const obtenerMetodosPago = async () => {
  const [rows] = await pool.query('SELECT * FROM metodos_pago');
  return rows;
};
import { pool } from '../config/db.js';

export const registrarVenta = async (venta, productos) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const unidades = productos.reduce((acc, p) => acc + p.cantidad, 0);
    const sub_total = productos.reduce((acc, p) => acc + (p.precio_venta * p.cantidad), 0);
    const iva = Math.round(sub_total * 0.19); // Asumiendo 19% de IVA
    const total = sub_total + iva;

    const [ventaRes] = await conn.query(
      `INSERT INTO venta (id_usuarios, id_metodo_pago, unidades, sub_total, iva, total, fecha) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [venta.id_usuario, venta.id_metodo_pago, unidades, sub_total, iva, total]
    );

    const id_venta = ventaRes.insertId;

    // Aquí podrías insertar detalle_venta si la tabla existe
    for (const prod of productos) {
      await conn.query(
        `UPDATE productos SET stock = stock - ? WHERE id_producto = ?`,
        [prod.cantidad, prod.id_producto]
      );
    }

    await conn.commit();
    return { id_venta, total };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};