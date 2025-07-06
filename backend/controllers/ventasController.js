import { obtenerMetodosPago } from '../models/ventaModel.js';

export const listarMetodosPago = async (req, res) => {
  try {
    const metodos = await obtenerMetodosPago();
    res.json(metodos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener métodos de pago' });
  }
};
import { registrarVenta as registrarVentaModel } from '../models/ventaModel.js';

export const registrarVenta = async (req, res) => {
  try {
    const { id_usuario, id_metodo_pago, productos } = req.body;

    if (!id_usuario || !id_metodo_pago || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Datos incompletos para la venta' });
    }

    const venta = await registrarVentaModel({ id_usuario, id_metodo_pago }, productos);
    res.status(201).json({ mensaje: 'Venta registrada correctamente', id_venta: venta.id_venta, total: venta.total });
  } catch (error) {
    console.error('❌ Error al registrar venta:', error);
    res.status(500).json({ error: 'Error al registrar la venta' });
  }
};