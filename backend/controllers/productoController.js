import {
addProducto,
deleteProducto,
getProductos,
updateProducto
} from '../models/productoModel.js';
export const obtenerProductos = async (req, res) => {
try {
const productos = await getProductos();
res.json(productos);
} catch (error) {
res.status(500).json({ error: error.message });
}
};
export const crearProducto = async (req, res) => {
try {
const producto = req.body;
const resultado = await addProducto(producto);
res.status(201).json({ mensaje_prod: 'Producto agregado', id:
resultado.insertId });
} catch (error) {
res.status(500).json({ error: error.message });
}
};
export const actualizarProducto = async (req, res) => {
try {
const id = req.params.id;
const actualizado = await updateProducto(id, req.body);
if (actualizado) {
res.json({ mensaje: 'Producto actualizado' });
} else {
res.status(404).json({ error: 'Producto no encontrado' });
}
} catch {
res.status(500).json({ error: 'Error al actualizar el producto' });
}
};
export const eliminarProducto = async (req, res) => {
try {
const id = req.params.id;
const eliminado = await deleteProducto(id);
if (eliminado) {
res.json({ mensaje: 'Producto eliminado' });
} else {
res.status(404).json({ error: 'Producto no encontrado' });
}
} catch {
res.status(500).json({ error: 'Error al eliminar el producto' });
}
};