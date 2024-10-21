import express from 'express';
import { accionBtn } from '../controllers/accionesController.js';


const router = express.Router();

// datos historicos de los sensores
// router.get('/historico', getSensorData);

// router.get('/ultimo', getSensorDataLast);

// Ruta para guardar los datos del sensor 
router.post('/', accionBtn);

export default router;
