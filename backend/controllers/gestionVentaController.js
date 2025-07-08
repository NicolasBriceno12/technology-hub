const db = require('../config/db');

// Obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
  try {
    const [ventas] = await db.query('SELECT * FROM gestion_ventas');
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ message: 'Error al obtener ventas' });
  }
};

// Actualizar una venta
exports.actualizarVenta = async (req, res) => {
  const { id } = req.params;
  const { descripcion, estado } = req.body;

  try {
    const [ventaActual] = await db.query('SELECT * FROM gestion_ventas WHERE id_venta = ?', [id]);
    if (ventaActual.length === 0) return res.status(404).json({ message: 'Venta no encontrada' });

    const nuevaDescripcion = descripcion || ventaActual[0].descripcion;
    const nuevoEstado = estado || ventaActual[0].estado;

    await db.query(
      'UPDATE gestion_ventas SET descripcion = ?, estado = ? WHERE id_venta = ?',
      [nuevaDescripcion, nuevoEstado, id]
    );

    res.json({ message: 'Venta actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar venta:', error);
    res.status(500).json({ message: 'Error al actualizar venta' });
  }
};

// Agregar nueva venta (opcional)
exports.agregarVenta = async (req, res) => {
  const { descripcion, estado } = req.body;

  try {
    if (!descripcion || !estado) return res.status(400).json({ message: 'Campos requeridos faltantes' });

    await db.query('INSERT INTO gestion_ventas (descripcion, estado) VALUES (?, ?)', [descripcion, estado]);

    res.json({ message: 'Venta agregada correctamente' });
  } catch (error) {
    console.error('Error al agregar venta:', error);
    res.status(500).json({ message: 'Error al agregar venta' });
  }
};

// Eliminar una venta
exports.eliminarVenta = async (req, res) => {
  const { id } = req.params;

  try {
    const [venta] = await db.query('SELECT * FROM gestion_ventas WHERE id_venta = ?', [id]);
    if (venta.length === 0) return res.status(404).json({ message: 'Venta no encontrada' });

    await db.query('DELETE FROM gestion_ventas WHERE id_venta = ?', [id]);
    res.json({ message: 'Venta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar venta:', error);
    res.status(500).json({ message: 'Error al eliminar venta' });
  }
};