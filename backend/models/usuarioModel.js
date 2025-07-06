import { pool } from '../config/db.js';

export const getUsuarios = async () => {
  const sql = `
    SELECT 
      u.id, 
      u.nombre, 
      u.nombre_usuario, 
      u.correo, 
      u.telefono, 
      r.nombre AS rol
    FROM usuarios u
    JOIN roles r ON u.id_rol = r.id
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

export const addUsuario = async (usuario) => {
  const {
    id_rol,
    id_presupuesto,
    nombre,
    nombre_usuario,
    contraseña,
    correo,
    telefono
  } = usuario;

  const sql = `
    INSERT INTO usuarios 
    (id_rol, id_presupuesto, nombre, nombre_usuario, contraseña, correo, telefono)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(sql, [
    id_rol,
    id_presupuesto,
    nombre,
    nombre_usuario,
    contraseña,
    correo,
    telefono
  ]);

  return result;
};