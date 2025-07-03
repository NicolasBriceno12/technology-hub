document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const nombre_usuario = document.getElementById('nombre_usuario').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const contraseña = document.getElementById('contraseña').value;
  const id_rol = document.getElementById('rol').value;
  const id_presupuesto = document.getElementById('presupuesto').value;

  if (
    !nombre ||
    !nombre_usuario ||
    !correo ||
    !telefono ||
    !contraseña ||
    !id_rol ||
    !id_presupuesto
  ) {
    alert('Por favor completa todos los campos.');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/register', {
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
      }),
    });

    const data = await res.json();
    alert(data.message || data.error || 'Respuesta desconocida');

    if (res.status === 201) {
      window.location.href = './login.html';
    }
  } catch (error) {
    console.error('Error al registrar:', error);
    alert('Ocurrió un error al conectar con el servidor.');
  }
});
