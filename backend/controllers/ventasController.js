import {
  obtenerMetodosPago,
  registrarVenta,
  registrarPago
} from '../models/ventaModel.js';

import {
  obtenerCarritoPorUsuario,
  vaciarCarrito
} from '../models/carritoModel.js';

// ✅ Obtener lista de métodos de pago
export const listarMetodosPago = async (req, res) => {
  try {
    const metodos = await obtenerMetodosPago();
    res.json(metodos);
  } catch (error) {
    console.error('Error al obtener métodos de pago:', error);
    res.status(500).json({ error: 'Error al obtener métodos de pago' });
  }
};

// ✅ Finalizar la venta
export const registrarVentaController = async (req, res) => {
  try {
    const { id_usuario, id_metodo_pago } = req.body;

    if (!id_usuario || !id_metodo_pago) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const carrito = await obtenerCarritoPorUsuario(id_usuario);
    if (carrito.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // ✅ Registrar la venta (incluye: venta, detalle_venta y actualizar stock)
    const { id_venta, total } = await registrarVenta(
      { id_usuario, id_metodo_pago },
      carrito
    );

    // ✅ Registrar el pago
    await registrarPago(id_venta, id_metodo_pago, total);

    // ✅ Vaciar carrito
    await vaciarCarrito(id_usuario);

    res.status(201).json({
      mensaje: 'Venta completada correctamente',
      id_venta,
      total
    });
  } catch (error) {
    console.error('❌ Error al registrar venta:', error);
    res.status(500).json({ error: 'Error al registrar la venta' });
  }
};