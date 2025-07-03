// controllers/rolesController.js
import { pool } from '../config/db.js';
export const obtenerRoles = async (req, res) => {
try {
const [roles] = await pool.query('SELECT * FROM roles');
res.json(roles);
} catch (error) {
res.status(500).json({ error: 'Error al obtener roles' });
}
};
