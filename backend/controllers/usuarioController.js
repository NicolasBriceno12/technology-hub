import bcrypt from 'bcrypt';
import { addUsuario, getUsuarios } from '../models/usuarioModel.js';

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

export const crearUsuario = async (req, res) => {
  const {
    id_rol,
    id_presupuesto,
    nombre,
    nombre_usuario,
    contraseña,
    correo,
    telefono
  } = req.body;

  if (
    !id_rol ||
    !id_presupuesto ||
    !nombre ||
    !nombre_usuario ||
    !contraseña ||
    !correo ||
    !telefono
  ) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = {
      id_rol,
      id_presupuesto,
      nombre,
      nombre_usuario,
      contraseña: hashedPassword,
      correo,
      telefono
    };

    const resultado = await addUsuario(nuevoUsuario);

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      id: resultado.insertId
    });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};