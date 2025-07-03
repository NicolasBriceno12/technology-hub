import express from 'express';
import { crearUsuario, obtenerUsuarios } from
'../controllers/usuarioController.js';
const router = express.Router();
router.get('/', obtenerUsuarios);
router.post('/', crearUsuario);
export default router;
