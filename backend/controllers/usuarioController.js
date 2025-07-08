const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Crear usuario
exports.crearUsuario = async (req, res) => {
  const {
    id_rol = 1,
    nombres,
    apellidos,
    nombre_usuario,
    contrasena,
    fecha_nacimiento,
    ciudad,
    direccion,
    correo,
    telefono,
    tipo_documento,
    numero_documento
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    await db.query(
      'INSERT INTO usuarios (id_rol, nombres, apellidos, nombre_usuario, contrasena, fecha_nacimiento, ciudad, direccion, correo, telefono, tipo_documento, numero_documento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id_rol, nombres, apellidos, nombre_usuario, hashedPassword, fecha_nacimiento, ciudad, direccion, correo, telefono, tipo_documento, numero_documento]
    );
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const [usuarios] = await db.query(
      `SELECT u.*, r.rol FROM usuarios u JOIN rol r ON u.id_rol = r.id_rol`
    );
    res.json(usuarios);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Actualizar usuario (actualización parcial)
exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE id_usuarios = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const usuarioActual = rows[0];

    const {
      nombres = usuarioActual.nombres,
      apellidos = usuarioActual.apellidos,
      nombre_usuario = usuarioActual.nombre_usuario,
      contrasena,
      correo = usuarioActual.correo,
      tipo_documento = usuarioActual.tipo_documento,
      numero_documento = usuarioActual.numero_documento,
      fecha_nacimiento = usuarioActual.fecha_nacimiento,
      ciudad = usuarioActual.ciudad,
      direccion = usuarioActual.direccion,
      telefono = usuarioActual.telefono,
      id_rol = usuarioActual.id_rol,
    } = req.body;

    let hashedPassword = usuarioActual.contrasena;
    if (contrasena && contrasena.trim() !== '') {
      hashedPassword = await bcrypt.hash(contrasena, 10);
    }

    await db.query(
      `UPDATE usuarios SET nombres = ?, apellidos = ?, nombre_usuario = ?, contrasena = ?, correo = ?, tipo_documento = ?, numero_documento = ?, fecha_nacimiento = ?, ciudad = ?, direccion = ?, telefono = ?, id_rol = ? WHERE id_usuarios = ?`,
      [nombres, apellidos, nombre_usuario, hashedPassword, correo, tipo_documento, numero_documento, fecha_nacimiento, ciudad, direccion, telefono, id_rol, id]
    );

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM usuarios WHERE id_usuarios = ?', [id]);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};