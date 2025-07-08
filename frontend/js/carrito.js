const API_URL = 'http://localhost:3000/api/productos';
const VENTAS_API_URL = 'http://localhost:3000/api/ventas';

const container = document.getElementById('productos-container');
const totalSpan = document.getElementById('total');
const subtotalSpan = document.getElementById('subtotal');
const finalizarBtn = document.getElementById('finalizar-compra');
const metodoPagoSelect = document.getElementById('metodo_pago');
const correoInput = document.getElementById('correo');

let carrito = [];
const ID_USUARIO = 1;

// ✅ Cargar productos desde la base de datos
fetch(API_URL)
  .then(res => res.json())
  .then(productos => {
    productos.forEach(p => {
      const card = document.createElement('div');
      card.classList.add('producto-card');
      card.innerHTML = `
        <img src="${p.imagen}" width="100">
        <h3>${p.nombre}</h3>
        <p>Precio: $${p.precio}</p>
        <p>Stock: ${p.stock}</p>
        <button onclick='agregarAlCarrito(${JSON.stringify(p)})'>Agregar</button>
      `;
      container.appendChild(card);
    });
  })
  .catch(err => {
    console.error('Error cargando productos:', err);
    alert('No se pudieron cargar los productos.');
  });

// ✅ Agregar producto al carrito
function agregarAlCarrito(producto) {
  const existente = carrito.find(p => p.id_producto === producto.id_producto);
  if (existente) {
    if (existente.cantidad < producto.stock) {
      existente.cantidad++;
    } else {
      alert('No hay más stock disponible.');
    }
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  renderizarCarrito();
}

// ✅ Mostrar carrito
function renderizarCarrito() {
  const tbody = document.querySelector('#tablaCarrito tbody');
  tbody.innerHTML = '';
  let total = 0;

  carrito.forEach((p, index) => {
    const subtotal = p.precio * p.cantidad;
    total += subtotal;

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${p.nombre}</td>
      <td>$${p.precio}</td>
      <td>${p.cantidad}</td>
      <td>$${subtotal.toFixed(2)}</td>
      <td><button onclick="eliminarDelCarrito(${index})">❌</button></td>
    `;
    tbody.appendChild(fila);
  });

  subtotalSpan.textContent = `$${total.toFixed(2)}`;
  totalSpan.textContent = `$${total.toFixed(2)}`;
}

// ✅ Eliminar del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  renderizarCarrito();
}

// ✅ Finalizar compra y enviar al backend
finalizarBtn.addEventListener('click', () => {
  if (carrito.length === 0) {
    alert('El carrito está vacío.');
    return;
  }

  const metodo_pago = metodoPagoSelect.value;
  if (!metodo_pago) {
    alert('Seleccione un método de pago.');
    return;
  }

  const correo = correoInput.value;

  const venta = {
    id_usuario: ID_USUARIO,
    metodo_pago,
    productos: carrito.map(p => ({
      id_producto: p.id_producto,
      cantidad: p.cantidad
    }))
  };

  if (correo) venta.correo = correo;

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
      alert(`¡Venta registrada con éxito! ID: ${data.id_venta}, Total: $${data.total}`);
      carrito = [];
      renderizarCarrito();
    })
    .catch(err => {
      console.error('Error al finalizar la compra:', err);
      alert('Error al procesar la venta.');
    });
});

// ✅ Mostrar mensaje si el carrito está vacío al cargar
document.addEventListener('DOMContentLoaded', () => {
  if (carrito.length === 0) {
    alert('El carrito está vacío.');
  }
});
