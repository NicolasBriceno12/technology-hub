import { pool } from '../config/db.js';

export async function verificarRol(req, res, next) {
  try {
    const { correo, rol } = req.body;

    if (!correo || !rol) {
      return res.status(400).json({ mensaje: 'Correo y rol son obligatorios' });
    }

    const [result] = await pool.query(
      'SELECT * FROM usuarios WHERE correo = ? AND id_rol = ?',
      [correo, rol]
    );

    if (result.length === 0) {
      return res.status(403).json({ mensaje: 'Acceso no autorizado: rol incorrecto' });
    }

    // Si el rol es correcto, continúa con la siguiente función
    next();
    
  } catch (error) {
    console.error('Error en authMiddleware:', error);
    res.status(500).json({ mensaje: 'Error del servidor al verificar el rol' });
  }
}
