import express from 'express';
import { registrarVenta } from '../controllers/ventasController.js';

const router = express.Router();

router.post('/', registrarVenta); // POST /api/ventas

export default router;