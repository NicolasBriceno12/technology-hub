import { pool } from '../config/db.js';

// Crear un nuevo usuario
export const crearUsuario = async ( id_rol,id_presupuesto,nombre,nombre_usuario,contraseña, correo,telefono) => {
  const [result] = await pool.query(
    'INSERT INTO usuarios (id_rol,id_presupuesto,nombre,nombre_usuario,contraseña,correo,telefono) VALUES (?, ?, ?, ?)',
    [id_rol,id_presupuesto,nombre,nombre_usuario,contraseña, correo,telefono]
  );
  return result.insertId;
};

// Buscar usuario por correo
export const buscarUsuarioPorCorreo = async (correo) => {
  const [rows] = await pool.query(
    'SELECT * FROM usuarios WHERE correo = ?',
    [correo]
  );
  return rows[0]; // Puede devolver undefined si no lo encuentra
};

// Obtener el nombre del rol por su ID
export const obtenerRolPorId = async (id_rol) => {
  const [rows] = await pool.query(
    'SELECT nombre FROM roles WHERE id = ?',
    [id_rol]
  );
  return rows[0]?.nombre || null; // Devuelve null si no se encuentra
};
