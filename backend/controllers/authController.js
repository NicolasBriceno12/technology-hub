
const bcrypt = require('bcryptjs');
const conexion = require('../config/db');

exports.register = async (req, res) => {
  try {
    console.log('📥 Registro recibido:', req.body);
    const {
      nombres,
      apellidos,
      nombre_usuario,
      correo,
      contrasena,
      fecha_nacimiento,
      ciudad,
      direccion,
      telefono,
      tipo_documento,
      numero_documento
    } = req.body;

    if (!nombres || !apellidos || !nombre_usuario || !correo || !contrasena || !fecha_nacimiento || !ciudad) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    conexion.query(
      'SELECT * FROM usuarios WHERE correo = ? OR nombre_usuario = ?',
      [correo, nombre_usuario],
      async (err, results) => {
        if (err) {
          console.error('Error al verificar usuario:', err);
          return res.status(500).json({ error: 'Error al verificar usuario' });
        }
        if (results.length > 0) {
          return res.status(400).json({ error: 'Correo o nombre de usuario ya registrados' });
        }

        const hashed = await bcrypt.hash(contrasena, 10);
        const sql = `
          INSERT INTO usuarios 
          (id_rol, nombres, apellidos, nombre_usuario, correo, contrasena, fecha_nacimiento, ciudad, direccion, telefono, tipo_documento, numero_documento)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const valores = [
          1,
          nombres,
          apellidos,
          nombre_usuario,
          correo,
          hashed,
          fecha_nacimiento,
          ciudad,
          direccion || null,
          telefono || null,
          tipo_documento || null,
          numero_documento || null
        ];

        conexion.query(sql, valores, (err, result) => {
          if (err) {
            console.error('Error al registrar usuario:', err);
            return res.status(500).json({ error: 'Error al registrar usuario' });
          }
          res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
        });
      }
    );
  } catch (e) {
    console.error('Error general registro:', e);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.login = (req, res) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena)
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });

  conexion.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al buscar usuario' });
    if (results.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

    const user = results[0];
    const match = await bcrypt.compare(contrasena, user.contrasena);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

    res.status(200).json({
      mensaje: 'Login exitoso',
      usuario: {
        id: user.id_usuarios,
        nombre: user.nombres,
        rol: user.id_rol
      }
    });
  });
};