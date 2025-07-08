const bcrypt = require('bcryptjs');
const conexion = require('../config/db');

// Registro de usuario
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

    // Verificar si el correo o nombre de usuario ya existen
    const [results] = await conexion.query(
      'SELECT * FROM usuarios WHERE correo = ? OR nombre_usuario = ?',
      [correo, nombre_usuario]
    );

    if (results.length > 0) {
      return res.status(400).json({ error: 'Correo o nombre de usuario ya registrados' });
    }

    // Encriptar contraseña
    const hashed = await bcrypt.hash(contrasena, 10);

    // CORREGIDO: Cadena SQL válida
    const sql = `
      INSERT INTO usuarios 
      (id_rol, nombres, apellidos, nombre_usuario, correo, contrasena, fecha_nacimiento, ciudad, direccion, telefono, tipo_documento, numero_documento)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
      1, // Rol por defecto: usuario
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

    await conexion.query(sql, valores);

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });

  } catch (e) {
    console.error('❌ Error general registro:', e);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    const [results] = await conexion.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = results[0];
    const match = await bcrypt.compare(contrasena, user.contrasena);

    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.status(200).json({
      mensaje: 'Login exitoso',
      usuario: {
        id: user.id_usuarios,
        nombre: user.nombres,
        rol: user.id_rol
      }
    });

  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};