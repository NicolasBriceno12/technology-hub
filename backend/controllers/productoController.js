import {
  addProducto,
  deleteProducto,
  getProductos,
  updateProducto
} from '../models/productoModel.js';

// ✅ Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await getProductos();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// ✅ Crear un producto
export const crearProducto = async (req, res) => {
  try {
    const producto = req.body;
    const resultado = await addProducto(producto);
    res.status(201).json({
      mensaje: 'Producto agregado correctamente',
      id: resultado.insertId
    });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Actualizar un producto
export const actualizarProducto = async (req, res) => {
  try {
    const id = req.params.id;
    const actualizado = await updateProducto(id, req.body);
    if (actualizado) {
      res.json({ mensaje: 'Producto actualizado correctamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// ✅ Eliminar un producto
export const eliminarProducto = async (req, res) => {
  try {
    const id = req.params.id;
    const eliminado = await deleteProducto(id);
    if (eliminado) {
      res.json({ mensaje: 'Producto eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};