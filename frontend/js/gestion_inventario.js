const tabla = document.getElementById('tabla-productos');
const form = document.getElementById('form-producto');

async function cargarProductos() {
  const res = await fetch('/api/productos');
  const productos = await res.json();

  tabla.innerHTML = '';
  productos.forEach(p => {
  console.log('Producto recibido:', p); // 👈 esto imprimirá cada objeto

  const fila = document.createElement('tr');
  // ...
});
  productos.forEach(p => {
    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td><img src="${p.imagen}" alt="${p.nombre}" height="80"></td>
      <td>${p.nombre}</td>
      <td>${p.descripcion}</td>
      <td>$${p.precio}</td>
      <td>${p.stock}</td>
      <td>${p.categoria || 'Sin categoría'}</td>
      <td>
        <button class="btn-eliminar">🗑️</button>
        <button class="btn-editar">✏️</button>
      </td>
    `;

    // Asignar eventos a los botones con p.id directamente
    const btnEliminar = fila.querySelector('.btn-eliminar');
    btnEliminar.addEventListener('click', () => {
      eliminarProducto(p.id_producto); // 👈 aquí p.id se pasa correctamente
    });

    const btnEditar = fila.querySelector('.btn-editar');
    btnEditar.addEventListener('click', () => {
      llenarFormulario(p); // también p contiene el objeto completo
    });

    tabla.appendChild(fila);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  data.precio = parseFloat(data.precio);
  data.stock = parseInt(data.stock);
  data.id_categoria = parseInt(data.id_categoria);

  const url = data.id ? `/api/productos/${data.id}` : '/api/productos';
  const method = data.id ? 'PUT' : 'POST';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  form.reset();
  document.getElementById('preview-img').style.display = 'none';
  delete data.id;
  cargarProductos();
});

async function eliminarProducto(id) {
  if (!id) {
    console.error('ID inválido para eliminar:', id);
    alert('No se pudo eliminar el producto. ID inválido.');
    return;
  }

  if (confirm('¿Estás seguro de eliminar este producto?')) {
    try {
      const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      cargarProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar producto.');
    }
  }
}

function llenarFormulario(p) {
  form.nombre.value = p.nombre;
  form.descripcion.value = p.descripcion;
  form.precio.value = p.precio;
  form.imagen.value = p.imagen;
  form.stock.value = p.stock;
  form.id_categoria.value = p.id_categoria;
  form.id = p.id;

  document.getElementById('preview-img').src = p.imagen;
  document.getElementById('preview-img').style.display = 'block';
}

async function cargarCategorias() {
  const res = await fetch('/api/productos/categorias');
  const categorias = await res.json();
  const select = document.getElementById('select-categorias');

  select.innerHTML = '<option value="">Selecciona una categoría</option>';
  categorias.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.nombre;
    select.appendChild(option);
  });
}

document.getElementById('imagen').addEventListener('input', function () {
  const url = this.value.trim();
  const preview = document.getElementById('preview-img');
  if (url) {
    preview.src = url;
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }
});

window.onload = () => {
  cargarCategorias();
  cargarProductos();
};