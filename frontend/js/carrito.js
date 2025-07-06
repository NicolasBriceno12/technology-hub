let carrito = []; // Productos seleccionados

// ✅ Al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    alert("Debes iniciar sesión primero");
    return window.location.href = "/frontend/pages/login.html";
  }

  // ✅ Si el usuario está logueado, sí se ejecuta esto:
  await cargarProductos();
  mostrarCarrito();
});
  
  await cargarMetodosPago();
  mostrarCarrito();

  async function cargarProductos() {
  try {
    const res = await fetch('http://localhost:3000/api/productos');
    const productos = await res.json();

    const select = document.getElementById('productoSelect');
    select.innerHTML = '<option value="">Seleccione un producto</option>';

    productos.forEach(p => {
      const option = document.createElement('option');
      option.value = JSON.stringify(p); // Guarda el objeto completo
      option.textContent = `${p.nombre_producto} - $${p.precio_venta}`;
      select.appendChild(option);
        const botonAgregar = document.getElementById('btnAgregarProducto');
    if (seleccionado.stock > 0) {
  botonAgregar.disabled = false;
  botonAgregar.title = "Agregar al carrito";
    } else {
    botonAgregar.disabled = true;
    botonAgregar.title = `Producto agotado: ${seleccionado.nombre_producto}`;
  alert(`El producto "${seleccionado.nombre_producto}" no tiene stock disponible.`);
  }
    });

    // Al seleccionar un producto, llenamos los campos ocultos
    select.addEventListener('change', () => {
  const seleccionado = JSON.parse(select.value);

  document.getElementById('id_producto').value = seleccionado.id_producto;
  document.getElementById('precio').value = seleccionado.precio_venta;
  document.getElementById('stock_disponible').value = seleccionado.stock;

  // 🔒 Validar si hay stock
  const botonAgregar = document.getElementById('btnAgregarProducto');
  if (seleccionado.stock > 0) {
    botonAgregar.disabled = false;
  } else {
    botonAgregar.disabled = true;
    alert(`El producto "${seleccionado.nombre_producto}" no tiene stock disponible.`);
    
    if (!select.value) {
  document.getElementById('btnAgregarProducto').disabled = true;
  return;
}
  }
});

  } catch (error) {
    console.error('Error al cargar productos:', error);
    alert('No se pudieron cargar los productos');
  }
}

  // Escuchar evento de pagar
  document.getElementById('btnPagar').addEventListener('click', pagar);

  // Escuchar formulario de agregar producto
document.getElementById('formAgregarCarrito').addEventListener('submit', (e) => {
  e.preventDefault();

  const id_producto = parseInt(document.getElementById('id_producto').value);
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const precio = parseFloat(document.getElementById('precio').value);
  const stock = parseInt(document.getElementById('stock_disponible').value);

  const nombre_producto = "Producto #" + id_producto;

  if (cantidad > stock) {
    return alert(`No puedes agregar más de ${stock} unidades disponibles`);
  }

  const existente = carrito.find(p => p.id_producto === id_producto);
  if (existente) {
    if ((existente.cantidad + cantidad) > stock) {
      return alert(`Ya tienes ${existente.cantidad} unidades. Máximo disponible: ${stock}`);
    }
    existente.cantidad += cantidad;
  } else {
    carrito.push({ id_producto, nombre_producto, precio_venta: precio, cantidad });
  }

  mostrarCarrito();
});

// ✅ Mostrar productos del carrito
function mostrarCarrito() {
  const tbody = document.querySelector('#tablaCarrito tbody');
  tbody.innerHTML = "";

  let subtotal = 0;

  carrito.forEach((item, index) => {
    const fila = document.createElement('tr');
    const totalProducto = item.precio_venta * item.cantidad;
    subtotal += totalProducto;

    fila.innerHTML = `
      <td>${item.nombre_producto}</td>
      <td>$${item.precio_venta}</td>
      <td>${item.cantidad}</td>
      <td>$${totalProducto}</td>
      <td><button onclick="eliminarDelCarrito(${index})">❌</button></td>
    `;
    tbody.appendChild(fila);
  });

  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  document.getElementById('subtotal').innerText = `$${subtotal}`;
  document.getElementById('total').innerText = `$${total}`;
}

// ✅ Eliminar producto del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  mostrarCarrito();
}

// ✅ Cargar métodos de pago desde el backend
async function cargarMetodosPago() {
  const res = await fetch('http://localhost:3000/api/ventas/metodos-pago');
  const metodos = await res.json();

  const select = document.getElementById('metodo_pago');
  select.innerHTML = '<option value="">Seleccione un método</option>';

  metodos.forEach(m => {
    const option = document.createElement('option');
    option.value = m.id_metodo_pago;
    option.textContent = m.metodo_pago;
    select.appendChild(option);
  });
}

// ✅ Registrar venta (pago)
async function pagar() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const metodo = parseInt(document.getElementById('metodo_pago').value);

  if (!metodo || carrito.length === 0) {
    return alert("Selecciona un método de pago y agrega productos al carrito");
  }

  const res = await fetch('http://localhost:3000/api/ventas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_usuario: usuario.id,
      id_metodo_pago: metodo,
      productos: carrito
    })
  });

  const data = await res.json();
  if (res.ok) {
    alert(data.mensaje + " Total pagado: $" + data.total);
    generarRecibo(usuario, carrito, data.total, metodo);
    carrito = [];
    mostrarCarrito();
  } else {
    alert("Error al procesar el pago: " + data.error);
  }
}

// ✅ Mostrar recibo en pantalla y descargar PDF
function generarRecibo(usuario, carrito, total, id_metodo_pago) {
  const metodoTexto = {
    1: 'Nequi',
    2: 'Tarjeta de crédito',
    3: 'Efectivo',
    4: 'PSE'
  }[id_metodo_pago] || 'Otro';

  const fecha = new Date().toLocaleString();

  const reciboHTML = `
    <div id="recibo" style="font-family: Arial; border: 1px solid #ccc; padding: 20px; margin-top: 20px;">
      <h2>Recibo de compra</h2>
      <p><strong>Cliente:</strong> ${usuario.nombre} (${usuario.correo})</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Método de pago:</strong> ${metodoTexto}</p>
      <table border="1" cellspacing="0" cellpadding="5" width="100%">
        <thead>
          <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Total</th></tr>
        </thead>
        <tbody>
          ${carrito.map(p =>
            `<tr>
              <td>${p.nombre_producto}</td>
              <td>$${p.precio_venta}</td>
              <td>${p.cantidad}</td>
              <td>$${p.precio_venta * p.cantidad}</td>
            </tr>`).join('')}
        </tbody>
      </table>
      <h3>Total pagado: $${total}</h3>
      <button onclick="descargarPDF()">Descargar PDF</button>
    </div>
  `;

  document.getElementById('reciboContainer').innerHTML = reciboHTML;
}

// ✅ Descargar el recibo como PDF
function descargarPDF() {
  const recibo = document.getElementById('recibo');
  const options = {
    margin: 1,
    filename: 'recibo_compra.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().from(recibo).set(options).save();
}