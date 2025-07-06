import { Router } from 'express';
import { listarMetodosPago, registrarVentaController } from '../controllers/ventasController.js';

const router = Router();

// Rutas
router.get('/metodos-pago', listarMetodosPago);
router.post('/', registrarVentaController);

export default router;