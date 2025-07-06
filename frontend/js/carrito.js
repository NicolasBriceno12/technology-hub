const precios = {
    cantidad1: 15,
    cantidad2: 25
  };
  
  function cambiarCantidad(id, cambio) {
    const input = document.getElementById(id);
    let valor = parseInt(input.value);
    valor = isNaN(valor) ? 1 : valor + cambio;
    if (valor < 1) valor = 1;
    input.value = valor;
    actualizarTotales();
  }
  
  function actualizarTotales() {
    const cantidad1 = parseInt(document.getElementById('cantidad1').value);
    const cantidad2 = parseInt(document.getElementById('cantidad2').value);
    const subtotal = (cantidad1 * precios.cantidad1) + (cantidad2 * precios.cantidad2);
    const envio = 5;
    const impuestos = 0;
    const total = subtotal + envio + impuestos;
  
    document.getElementById('subtotal').innerText = `$${subtotal}`;
    document.getElementById('total').innerText = `$${total}`;
  }
  
  // Inicializar al cargar
  actualizarTotales();


  document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('http://localhost:3000/api/productos');
  const productos = await res.json();
  productosGlobal = productos;
  renderProductos(productos);

  await cargarMetodosPago();

  document.getElementById('btnPagar').addEventListener('click', pagar);
});

async function cargarMetodosPago() {
  const res = await fetch('http://localhost:3000/api/ventas/metodos-pago');
  const metodos = await res.json();

  const select = document.getElementById('metodo_pago');
  select.innerHTML = '<option disabled selected value="">Seleccione un método</option>';
  metodos.forEach(m => {
    const option = document.createElement('option');
    option.value = m.id_metodo_pago;
    option.textContent = m.metodo_pago;
    select.appendChild(option);
  });
}

async function pagar() {
  const correo = localStorage.getItem('correo');
  const metodo_pago = parseInt(document.getElementById('metodo_pago').value);

  if (!correo || isNaN(metodo_pago)) {
    return alert('Por favor selecciona un método de pago y asegúrate de estar logueado');
  }

  const usuarioRes = await fetch('http://localhost:3000/api/usuarios');
  const usuarios = await usuarioRes.json();
  const usuario = usuarios.find(u => u.correo === correo);
  if (!usuario) return alert('Usuario no encontrado');

  const carritoRes = await fetch('http://localhost:3000/api/ventas/pagar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_usuario: usuario.id,
      id_metodo_pago: metodo_pago
    })
  });

  const data = await carritoRes.json();
  alert(data.mensaje + '\nTotal pagado: $' + data.total);

  carrito = [];
  renderCarrito();
}

export const registrarPago = async (id_carrito, id_metodo_pago, total) => {
  const [result] = await pool.query(
    'INSERT INTO pagos (id_carrito, id_metodo_pago, total) VALUES (?, ?, ?)',
    [id_carrito, id_metodo_pago, total]
  );
  return result.insertId;
};

generarRecibo(usuario, carrito, data.total, metodo_pago);
function generarRecibo(usuario, carrito, total, id_metodo_pago) {
  const metodoTexto = {
    1: 'Nequi',
    2: 'Tarjeta de crédito',
    3: 'Efectivo',
    4: 'PSE'
  }[id_metodo_pago] || 'Desconocido';

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
            </tr>`
          ).join('')}
        </tbody>
      </table>
      <h3>Total pagado: $${total}</h3>
      <button onclick="descargarPDF()">Descargar PDF</button>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', reciboHTML);
}

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

const res = await fetch('http://localhost:3000/api/ventas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id_usuario: usuario.id,
    id_metodo_pago: parseInt(document.getElementById('metodo_pago').value),
    productos: carrito
  })
});