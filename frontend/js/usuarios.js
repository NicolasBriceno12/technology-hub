document.addEventListener('DOMContentLoaded', () => {
  cargarUsuarios();

  document.getElementById('btn-agregar').addEventListener('click', async () => {
    const datos = obtenerDatosFormulario();
    try {
      const res = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      if (res.ok) {
        alert('✅ Usuario agregado correctamente.');
        limpiarFormulario();
        cargarUsuarios();
      } else {
        const error = await res.json();
        alert(`❌ Error al agregar usuario: ${error.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Error al conectarse con el servidor.');
    }
  });

  document.getElementById('btn-modificar').addEventListener('click', async () => {
    const datos = obtenerDatosFormulario();
    const id = datos.id_usuarios;
    if (!id) return alert('⚠️ Debes ingresar el ID del usuario a modificar.');

    // Solo enviar campos no vacíos
    const datosFiltrados = {};
    Object.entries(datos).forEach(([key, value]) => {
      if (value !== '') datosFiltrados[key] = value;
    });

    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosFiltrados),
      });

      if (res.ok) {
        alert('✅ Usuario modificado correctamente.');
        limpiarFormulario();
        cargarUsuarios();
      } else {
        const error = await res.json();
        alert(`❌ Error al modificar usuario: ${error.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Error al conectarse con el servidor.');
    }
  });

  document.getElementById('btn-eliminar').addEventListener('click', async () => {
    const id = document.getElementById('id_usuarios').value;
    if (!id) return alert('⚠️ Debes ingresar el ID del usuario a eliminar.');

    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('🗑️ Usuario eliminado correctamente.');
        limpiarFormulario();
        cargarUsuarios();
      } else {
        const error = await res.json();
        alert(`❌ Error al eliminar usuario: ${error.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Error al conectarse con el servidor.');
    }
  });
});

function obtenerDatosFormulario() {
  return {
    id_usuarios: document.getElementById('id_usuarios').value,
    nombres: document.getElementById('nombres').value,
    apellidos: document.getElementById('apellidos').value,
    nombre_usuario: document.getElementById('nombre_usuario').value,
    contrasena: document.getElementById('contrasena').value,
    correo: document.getElementById('correo').value,
    tipo_documento: document.getElementById('tipo_documento').value,
    numero_documento: document.getElementById('numero_documento').value,
    fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
    ciudad: document.getElementById('ciudad').value,
    direccion: document.getElementById('direccion').value,
    telefono: document.getElementById('telefono').value,
    id_rol: document.getElementById('id_rol').value,
  };
}

function limpiarFormulario() {
  [
    'id_usuarios', 'nombres', 'apellidos', 'nombre_usuario', 'contrasena',
    'correo', 'tipo_documento', 'numero_documento', 'fecha_nacimiento',
    'ciudad', 'direccion', 'telefono', 'id_rol'
  ].forEach(id => document.getElementById(id).value = '');
}

async function cargarUsuarios() {
  const res = await fetch('http://localhost:3000/api/usuarios');
  const usuarios = await res.json();
  const tbody = document.querySelector('#tabla-usuarios tbody');
  tbody.innerHTML = '';

  usuarios.forEach((usuario) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${usuario.id_usuarios}</td>
      <td>${usuario.nombre_usuario}</td>
      <td>${usuario.numero_documento}</td>
      <td>${usuario.rol}</td>
      <td>${usuario.id_rol}</td>
    `;
    tbody.appendChild(tr);
  });

  asignarEventosFilas(usuarios);
}

function asignarEventosFilas(usuarios) {
  const filas = document.querySelectorAll('#tabla-usuarios tbody tr');
  filas.forEach((fila, index) => {
    fila.addEventListener('click', () => {
      const usuario = usuarios[index];
      document.getElementById('id_usuarios').value = usuario.id_usuarios;
      document.getElementById('nombres').value = usuario.nombres || '';
      document.getElementById('apellidos').value = usuario.apellidos || '';
      document.getElementById('nombre_usuario').value = usuario.nombre_usuario || '';
      document.getElementById('contrasena').value = '';
      document.getElementById('correo').value = usuario.correo || '';
      document.getElementById('tipo_documento').value = usuario.tipo_documento || '';
      document.getElementById('numero_documento').value = usuario.numero_documento || '';
      document.getElementById('fecha_nacimiento').value = usuario.fecha_nacimiento?.split('T')[0] || '';
      document.getElementById('ciudad').value = usuario.ciudad || '';
      document.getElementById('direccion').value = usuario.direccion || '';
      document.getElementById('telefono').value = usuario.telefono || '';
      document.getElementById('id_rol').value = usuario.id_rol || '';
      alert(`✏️ Editando usuario: ${usuario.nombre_usuario}`);
    });
  });
}