const tabla = document.getElementById('tabla-productos');
const form = document.getElementById('form-producto');

async function cargarProductos() {
  const res = await fetch('/api/productos');
  const productos = await res.json();

  tabla.innerHTML = '';
  productos.forEach(p => {
    p.id = p.id || p.id_producto;
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

  if (!p.id) {
    console.error('❌ El producto no tiene ID válido:', p);
    alert('Error: el producto seleccionado no tiene un ID válido.');
    return;
  }

  document.getElementById('id_producto').value = p.id;
  document.getElementById('nombre').value = p.nombre;
  document.getElementById('descripcion').value = p.descripcion;
  document.getElementById('precio').value = p.precio;
  const preview = document.getElementById('preview-img');
if (p.imagen) {
  preview.src = p.imagen;
  preview.style.display = 'block';
} else {
  preview.style.display = 'none';
}
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

document.getElementById('imagen').addEventListener('change', function (event) {
  const file = event.target.files[0];
  const preview = document.getElementById('preview-img');

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = '';
    preview.style.display = 'none';
  }
});

document.getElementById('btn-agregar').addEventListener('click', async () => {
  const form = document.getElementById('form-producto');
  const formData = new FormData(form); // Recoge todos los campos incluyendo el archivo

  // Validación básica
  const nombre = formData.get('nombre');
  const precio = parseFloat(formData.get('precio'));
  if (!nombre || isNaN(precio)) {
    alert('⚠️ Por favor completa correctamente el nombre y el precio.');
    return;
  }

  try {
    const res = await fetch('/api/productos', {
      method: 'POST',
      body: formData // Aquí va FormData, sin headers
    });

    if (res.ok) {
      alert('✅ Producto agregado correctamente');
      form.reset();
      document.getElementById('preview-img').style.display = 'none';
      cargarProductos();
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