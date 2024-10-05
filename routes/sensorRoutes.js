import express from 'express';
import { saveSensorData } from '../controllers/sensorController.js';

const router = express.Router();

// Ruta para obtener y guardar los datos del sensor
router.get('/', saveSensorData);

export default router;
