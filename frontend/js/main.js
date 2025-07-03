const API_URL = 'http://localhost:3000/api/usuarios';
const API_ROLES = 'http://localhost:3000/api/roles';

document.getElementById('formUsuario').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const nombre_usuario = document.getElementById('nombre_usuario').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const contraseña = document.getElementById('contraseña').value;
  const id_rol = document.getElementById('id_rol').value;
  const id_presupuesto = document.getElementById('id_presupuesto').value;

  // Validación básica
  if (!nombre || !nombre_usuario || !correo || !telefono || !contraseña || !id_rol || !id_presupuesto) {
    alert('Todos los campos son obligatorios');
    return;
  }

  try {
    const respuesta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        nombre_usuario,
        correo,
        telefono,
        contraseña,
        id_rol,
        id_presupuesto
      })
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
      alert(datos.mensaje || 'Usuario agregado correctamente');
      document.getElementById('formUsuario').reset();
      cargarUsuarios();
    } else {
      alert('Error al agregar usuario: ' + (datos.error || datos.message));
    }
  } catch (error) {
    alert('Error al conectar con el servidor');
    console.error(error);
  }
});

async function cargarUsuarios() {
  try {
    const res = await fetch(API_URL);
    const usuarios = await res.json();

    const tabla = document.getElementById('tablaUsuarios');
    tabla.innerHTML = ''; // Limpiar tabla

    usuarios.forEach(usuario => {
      const row = `
        <tr>
          <td>${usuario.id}</td>
          <td>${usuario.nombre}</td>
          <td>${usuario.nombre_usuario}</td>
          <td>${usuario.correo}</td>
          <td>${usuario.telefono}</td>
          <td>${usuario.rol || 'Sin rol'}</td>
        </tr>
      `;
      tabla.innerHTML += row;
    });
  } catch (error) {
    console.error('Error al cargar los usuarios:', error);
  }
}

async function cargarRoles() {
  try {
    const res = await fetch(API_ROLES);
    const roles = await res.json();

    const select = document.getElementById('id_rol');
    select.innerHTML = '<option disabled selected value="">Seleccione un rol</option>';

    roles.forEach(rol => {
      const option = document.createElement('option');
      option.value = rol.id;
      option.textContent = rol.nombre;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar roles:', error);
  }
}

// Inicializar
cargarRoles();
cargarUsuarios();
