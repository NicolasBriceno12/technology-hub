const API_VENTAS = 'http://localhost:3000/api/ventas';
const API_USUARIOS = 'http://localhost:3000/api/usuarios';
const API_PRODUCTOS = 'http://localhost:3000/api/productos';
let carrito = [];
let productosDisponibles = [];
let editandoVentaId = null;
// Carga usuarios y productos al inicio
async function cargarUsuariosYProductos() {
const usuarios = await (await fetch(API_USUARIOS)).json();
const productos = await (await fetch(API_PRODUCTOS)).json();
productosDisponibles = productos; // para control de stock y precios
const usuarioSelect = document.getElementById('usuario');
usuarioSelect.innerHTML = '<option value="">Seleccione usuario</option>';
usuarios.forEach(u => {
usuarioSelect.innerHTML += `<option
value="${u.id}">${u.nombre}</option>`;
});
const productoSelect = document.getElementById('producto');
productoSelect.innerHTML = '<option value="">Seleccione Producto</option>';
productos.forEach(p => {
productoSelect.innerHTML += `<option value="${p.id}">${p.nombre_prod}
(Stock: ${p.stock})</option>`;
});
}
// Función para mostrar carrito
function mostrarCarrito() {
const tabla = document.getElementById('tablaCarrito');
tabla.innerHTML = '';
let total = 0;
carrito.forEach((item, index) => {
const subtotal = item.precio * item.cantidad;
total += subtotal;
tabla.innerHTML += `
<tr>
<td>${item.nombre_prod}</td>
<td>${item.cantidad}</td>
<td>$${item.precio.toFixed(2)}</td>
<td>$${subtotal.toFixed(2)}</td>
<td><button
onclick="eliminarProducto(${index})">Eliminar</button></td>
</tr>
`;
});
document.getElementById('totalVenta').innerHTML = `<strong>Total:
$${total.toFixed(2)}</strong>`;
}
// Función para eliminar producto del carrito
window.eliminarProducto = (index) => {
carrito.splice(index, 1);
mostrarCarrito();
};
// Agregar producto al carrito
document.getElementById('btnAgregarProducto').addEventListener('click', () => {
const productoId = parseInt(document.getElementById('producto').value);
const cantidad = parseInt(document.getElementById('cantidad').value);
if (!productoId || !cantidad || cantidad <= 0) {
alert('Seleccione producto y cantidad válida');
return;
}
// Buscar producto en disponibles
const producto = productosDisponibles.find(p => p.id === productoId);
if (!producto) {
alert('Producto no encontrado');
return;
}
// Verificar stock
const cantidadEnCarrito = carrito.filter(p => p.id ===
productoId).reduce((acc, cur) => acc + cur.cantidad, 0);
if (cantidad + cantidadEnCarrito > producto.stock) {
alert('Cantidad supera el stock disponible');
return;
}
// Si ya está en el carrito, sumar cantidad
const itemExistente = carrito.find(p => p.id === productoId);
if (itemExistente) {
itemExistente.cantidad += cantidad;
} else {
carrito.push({
id: producto.id,
nombre_prod: producto.nombre_prod,
cantidad,
precio: parseFloat(producto.precio)
});
}
mostrarCarrito();
// Limpiar campos cantidad y producto
document.getElementById('cantidad').value = '';
document.getElementById('producto').value = '';
});
// Enviar venta al backend
document.getElementById('formVenta').addEventListener('submit', async (e) =>
{
e.preventDefault();
const id_usuario = document.getElementById('usuario').value;
const metodo_pago = document.getElementById('metodo_pago').value;
if (!id_usuario) {
alert('Seleccione un usuario');
return;
}
if (!metodo_pago) {
alert('Seleccione un método de pago');
return;
}
if (carrito.length === 0) {
alert('Agregue al menos un producto al carrito');
return;
}
const productosEnvio = carrito.map(p => ({ id_producto: p.id, cantidad:
p.cantidad }));
try {
const res = await fetch(API_VENTAS, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
id_usuario,
metodo_pago, // ← nuevo campo
productos: productosEnvio
})
});
const data = await res.json();
if (res.ok) {
alert('Venta registrada correctamente');
carrito = [];
mostrarCarrito();
document.getElementById('usuario').value = '';
document.getElementById('metodo_pago').value = ''; // ← limpiar select
cargarVentas();
} else {
alert('Error: ' + data.error);
}
} catch (error) {
alert('Error en la solicitud: ' + error.message);
}
});
// Cargar ventas registradas (igual que antes)
async function cargarVentas() {
try {
const ventas = await (await fetch(API_VENTAS)).json();
const tabla = document.getElementById('tablaVentas');
tabla.innerHTML = '';
ventas.forEach(v => {
const precio = parseFloat(v.precio_unitario);
const subtotal = parseFloat(v.subtotal);
const total = parseFloat(v.total);
tabla.innerHTML += `
<tr>
<td>${v.id_venta}</td>
<td>${v.usuario}</td>
<td>${v.producto}</td>
<td>${v.cantidad}</td>
<td>$${Number(v.precio_unitario).toFixed(2)}</td>
<td>$${Number(v.subtotal).toFixed(2)}</td>
<td>$${Number(v.total).toFixed(2)}</td>
<td>${new Date(v.fecha).toLocaleString()}</td>
<td>
<button onclick="editarVenta(${v.id_venta})">Editar</button>
<button onclick="eliminarVenta(${v.id_venta})">Eliminar</button>
</td>
</tr>
`;
});
} catch (error) {
console.error('Error al cargar ventas:', error);
}
}
async function eliminarVenta(id) {
if (!confirm('¿Estás seguro de que deseas eliminar esta venta?')) return;
try {
const res = await fetch(`${API_VENTAS}/${id}`, {
method: 'DELETE',
});
if (res.ok) {
alert('Venta eliminada con éxito');
cargarVentas(); // Recarga la tabla
} else {
const error = await res.json();
alert(`Error: ${error.message || error.error}`);
}
} catch (err) {
console.error('Error al eliminar venta:', err);
alert('Error al eliminar la venta.');
}
}
async function editarVenta(id) {
console.log('Editando venta con id:', id); // log para debug
const nuevaCantidad = prompt('Ingresa la nueva cantidad:');
const cantidad = parseInt(nuevaCantidad);
if (isNaN(cantidad) || cantidad <= 0) return alert('Cantidad inválida');
try {
const ventaResponse = await fetch(`${API_VENTAS}/${id}`);
if (!ventaResponse.ok) {
const errorData = await ventaResponse.json();
return alert(`Error al obtener la venta: ${errorData.error ||
ventaResponse.statusText}`);
}
const venta = await ventaResponse.json();
const body = {
id_usuario: venta.id_usuario,
id_producto: venta.id_producto,
cantidad: cantidad
};
const res = await fetch(`${API_VENTAS}/${id}`, {
method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(body)
});
if (res.ok) {
alert('Venta actualizada correctamente');
cargarVentas();
} else {
const error = await res.json();
alert(`Error al actualizar: ${error.message || error.error}`);
}
} catch (err) {
console.error('Error al editar venta:', err);
alert('Error al editar la venta.');
}
}
cargarUsuariosYProductos();
cargarVentas();
mostrarCarrito();