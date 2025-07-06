import { pool } from '../config/db.js';

export const obtenerMetodosPago = async () => {
  const [rows] = await pool.query('SELECT * FROM metodo_pago'); // Usa el nombre correcto de la tabla
  return rows;
};

export const registrarPago = async (id_venta, id_metodo_pago, total) => {
  const [result] = await pool.query(
    'INSERT INTO pago (id_venta, id_metodo_pago, monto, fecha_pago) VALUES (?, ?, ?, NOW())',
    [id_venta, id_metodo_pago, total]
  );
  return result.insertId;
};

export const agregarDetalleVenta = async ({ id_venta, id_producto, cantidad, subtotal }) => {
  const [result] = await pool.query(
    `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, subtotal)
     VALUES (?, ?, ?, ?)`,
    [id_venta, id_producto, cantidad, subtotal]
  );
  return result;
};

export const registrarVenta = async (venta, productos) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const unidades = productos.reduce((acc, p) => acc + p.cantidad, 0);
    const sub_total = productos.reduce((acc, p) => acc + (p.precio_venta * p.cantidad), 0);
    const iva = Math.round(sub_total * 0.19); // Asumiendo 19% de IVA
    const total = sub_total + iva;

    // 1. Insertar la venta
    const [ventaRes] = await conn.query(
      `INSERT INTO venta (id_usuario, id_metodo_pago, unidades, sub_total, iva, total, fecha) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [venta.id_usuario, venta.id_metodo_pago, unidades, sub_total, iva, total]
    );

    const id_venta = ventaRes.insertId;

    // 2. Insertar detalle por cada producto
    for (const prod of productos) {
      const subtotal = prod.precio_venta * prod.cantidad;

      await conn.query(
        `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, subtotal) 
         VALUES (?, ?, ?, ?)`,
        [id_venta, prod.id_producto, prod.cantidad, subtotal]
      );

      // 3. Actualizar stock
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