import db from '../config/db.js';

// Agregar producto al carrito
const agregarAlCarrito = async (req, res) => {
    try {
        const { id_usuario, id_producto, cantidad } = req.body;
        
        // Verificar si el producto ya existe en el carrito
        const [productoExistente] = await db.query(
            'SELECT * FROM carrito WHERE id_usuario = ? AND id_producto = ?',
            [id_usuario, id_producto]
        );
        
        if (productoExistente.length > 0) {
            // Si existe, actualizar la cantidad
            const nuevaCantidad = productoExistente[0].cantidad + cantidad;
            await db.query(
                'UPDATE carrito SET cantidad = ? WHERE id_usuario = ? AND id_producto = ?',
                [nuevaCantidad, id_usuario, id_producto]
            );
        } else {
            // Si no existe, insertar nuevo producto
            await db.query(
                'INSERT INTO carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)',
                [id_usuario, id_producto, cantidad]
            );
        }
        
        res.json({ success: true, message: 'Producto agregado al carrito' });
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

// Obtener carrito del usuario
const obtenerCarrito = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        
        const [carrito] = await db.query(`
            SELECT c.*, p.nombre_producto, p.precio_venta, p.stock,
                   (c.cantidad * p.precio_venta) as subtotal
            FROM carrito c
            JOIN producto p ON c.id_producto = p.id_producto
            WHERE c.id_usuario = ?
        `, [id_usuario]);
        
        // Calcular total
        const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);
        
        res.json({ 
            success: true, 
            carrito: carrito,
            total: total,
            cantidad_items: carrito.length
        });
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

// Actualizar cantidad de producto en carrito
const actualizarCantidad = async (req, res) => {
    try {
        const { id_carrito, cantidad } = req.body;
        
        if (cantidad <= 0) {
            // Si cantidad es 0 o negativa, eliminar del carrito
            await db.query('DELETE FROM carrito WHERE id_carrito = ?', [id_carrito]);
        } else {
            // Actualizar cantidad
            await db.query(
                'UPDATE carrito SET cantidad = ? WHERE id_carrito = ?',
                [cantidad, id_carrito]
            );
        }
        
        res.json({ success: true, message: 'Cantidad actualizada' });
    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

// Eliminar producto del carrito
const eliminarDelCarrito = async (req, res) => {
    try {
        const { id_carrito } = req.params;
        
        await db.query('DELETE FROM carrito WHERE id_carrito = ?', [id_carrito]);
        
        res.json({ success: true, message: 'Producto eliminado del carrito' });
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

// Limpiar carrito
const limpiarCarrito = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        
        await db.query('DELETE FROM carrito WHERE id_usuario = ?', [id_usuario]);
        
        res.json({ success: true, message: 'Carrito limpiado' });
    } catch (error) {
        console.error('Error al limpiar carrito:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

export {
    agregarAlCarrito,
    obtenerCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    limpiarCarrito
};