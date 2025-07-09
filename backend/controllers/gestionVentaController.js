const GestionVenta = require('../models/gestionVenta');

// Obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
  try {
    const ventas = await GestionVenta.getAll();
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ message: 'Error al obtener ventas' });
  }
};

// Agregar nueva venta
exports.agregarVenta = async (req, res) => {
  const { id_venta, descripcion, estado } = req.body;

  try {
    if (!id_venta || !descripcion || !estado) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    await GestionVenta.create({ id_venta, descripcion, estado });

    res.json({ message: 'Venta agregada correctamente' });
  } catch (error) {
    console.error('Error al agregar venta:', error);
    res.status(500).json({ message: 'Error al agregar venta' });
  }
};

// Actualizar una venta
exports.actualizarVenta = async (req, res) => {
  const { id } = req.params;
  const { descripcion, estado } = req.body;

  try {
    const actualizado = await GestionVenta.update(id, { descripcion, estado });
    if (!actualizado) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    res.json({ message: 'Venta actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar venta:', error);
    res.status(500).json({ message: 'Error al actualizar venta' });
  }
};