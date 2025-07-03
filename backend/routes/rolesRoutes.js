// routes/rolesRoutes.js
import express from 'express';
import { obtenerRoles } from '../controllers/rolesController.js';
const router = express.Router();
router.get('/', obtenerRoles);
export default router;