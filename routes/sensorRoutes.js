import express from 'express';
import { saveSensorData, getSensorData } from '../controllers/sensorController.js';

const router = express.Router();

// datos historicos de los sensores
router.get('/historico', getSensorData);

// Ruta para guardar los datos del sensor 
router.post('/', saveSensorData);

export default router;
