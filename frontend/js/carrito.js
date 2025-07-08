const API_URL = 'http://localhost:3000/api/productos';
const VENTAS_API_URL = 'http://localhost:3000/api/ventas';
const container = document.getElementById('productos-container');
const carritoLista = document.getElementById('carrito-lista');
const totalSpan = document.getElementById('total');
const finalizarBtn = document.getElementById('finalizar-compra');
let carrito = [];
// Simulación de usuario logueado (ajusta esto según tu lógica de login real)
const ID_USUARIO = 1;
// Cargar productos desde API
fetch(API_URL)
.then(res => res.json())
.then(productos => {
productos.forEach(p => {
const card = document.createElement('div');
card.innerHTML = `
<img src="${p.imagen_url}" width="100">
<h3>${p.nombre_prod}</h3>
<p>Precio: $${p.precio}</p>
<button
onclick='agregarAlCarrito(${JSON.stringify(p)})'>Agregar</button>
`;
container.appendChild(card);
});
});
// Agregar productos al carrito
function agregarAlCarrito(producto) {
const existente = carrito.find(p => p.id === producto.id);
if (existente) {
existente.cantidad++;
} else {
carrito.push({ ...producto, cantidad: 1 });
}
renderizarCarrito();
}
// Mostrar carrito actualizado
function renderizarCarrito() {
carritoLista.innerHTML = '';
let total = 0;
carrito.forEach((p, index) => {
const li = document.createElement('li');
li.innerHTML = `
${p.nombre_prod} x${p.cantidad} - $${(p.precio *
p.cantidad).toFixed(2)}
<button onclick="eliminarDelCarrito(${index})">Eliminar</button>
`;
carritoLista.appendChild(li);
total += p.precio * p.cantidad;
});
totalSpan.textContent = total.toFixed(2);
}
// Eliminar producto del carrito
function eliminarDelCarrito(index) {
carrito.splice(index, 1);
renderizarCarrito();
}
// Finalizar compra
finalizarBtn.addEventListener('click', () => {
if (carrito.length === 0) {
alert('El carrito está vacío.');
return;
}
const metodo_pago = document.getElementById('metodo_pago').value;
if (!metodo_pago) {
alert('Seleccione un método de pago.');
return;
}
const correo = document.getElementById('correo').value;
const venta = {
id_usuario: ID_USUARIO,
metodo_pago,
productos: carrito.map(p => ({
id_producto: p.id,
cantidad: p.cantidad
}))
};
if (correo) venta.correo = correo;
// Enviar al backend
fetch(VENTAS_API_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify(venta)
})
.then(res => res.json())
.then(data => {
if (data.error) {
alert('Error al registrar la venta: ' + data.error);
return;
}
alert(`¡Venta registrada con éxito! ID: ${data.id_venta}, Total:
$${data.total}`);
carrito = [];
renderizarCarrito();
})
.catch(err => {
console.error('Error al finalizar la compra:', err);
alert('Error al procesar la venta.');
});
});
