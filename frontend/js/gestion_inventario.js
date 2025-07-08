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

    const btnEliminar = fila.querySelector('.btn-eliminar');
    btnEliminar.addEventListener('click', () => {
      eliminarProducto(p.id); 
    });

    const btnEditar = fila.querySelector('.btn-editar');
    btnEditar.addEventListener('click', () => {
      llenarFormulario(p);
    });

    tabla.appendChild(fila);
  });
}


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

async function llenarFormulario(p) {
  document.getElementById('id_producto').value = p.id;
  document.getElementById('nombre').value = p.nombre;
  document.getElementById('descripcion').value = p.descripcion;
  document.getElementById('precio').value = p.precio;
  document.getElementById('imagen').value = p.imagen;
  document.getElementById('stock').value = p.stock;

  // Esperamos a que se carguen las categorías
  await cargarCategorias();

  // Una vez cargado el select, asignamos la categoría
  const selectCategoria = document.getElementById('select-categorias');
  if (selectCategoria) {
    selectCategoria.value = p.id_categoria || '';
  }
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

document.getElementById('btn-agregar').addEventListener('click', async () => {
  const form = document.getElementById('form-producto'); // Asegúrate que tu form tenga este id
  const data = Object.fromEntries(new FormData(form).entries());

  // Validaciones básicas
  if (!data.nombre || !data.precio || isNaN(parseFloat(data.precio))) {
    alert('⚠️ Por favor completa correctamente el nombre y el precio.');
    return;
  }

  // Conversión de datos
  data.precio = parseFloat(data.precio);
  data.stock = parseInt(data.stock) || 0;
  data.id_categoria = parseInt(data.id_categoria);

  try {
    const res = await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert('✅ Producto agregado correctamente');
      form.reset();
      document.getElementById('preview-img').style.display = 'none';
      cargarProductos(); // Vuelve a cargar la tabla
    } else {
      const err = await res.json();
      console.error(err);
      alert('❌ Error al agregar el producto');
    }
  } catch (error) {
    console.error(error);
    alert('❌ Error de conexión al servidor');
  }
});

document.getElementById('btn-modificar').addEventListener('click', async () => {
  const id = document.getElementById('id_producto').value;

  if (!id) {
    alert('⚠️ Primero selecciona un producto desde la tabla con el ícono ✏️');
    return;
  }

  const nombre = document.getElementById('nombre').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const precio = parseFloat(document.getElementById('precio').value);
  const imagen = document.getElementById('imagen').value.trim();
  const stock = parseInt(document.getElementById('stock').value);
  const id_categoria = parseInt(document.getElementById('select-categorias').value);

  if (!nombre || isNaN(precio)) {
    alert('⚠️ Verifica que el nombre y el precio sean válidos');
    return;
  }

  const productoModificado = {
    nombre,
    descripcion,
    precio,
    imagen,
    stock,
    id_categoria
  };

  try {
    const res = await fetch(`/api/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productoModificado)
    });

    const data = await res.json();

    if (res.ok) {
      alert('✅ Producto modificado correctamente');
      cargarProductos(); // Vuelve a cargar la tabla
    } else {
      console.error(data);
      alert('❌ Error al modificar producto');
    }
  } catch (error) {
    console.error(error);
    alert('❌ Error de conexión al servidor');
  }
});

window.onload = () => {
  cargarCategorias();
  cargarProductos();
};