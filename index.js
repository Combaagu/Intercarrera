// index.js
import express from 'express';
import connectDB from './database/db.js';
import cookieParser from 'cookie-parser';
import sensorRoutes from './routes/sensorRoutes.js';
import userRoutes from './routes/authRoutes.js'; 
import dotenv from 'dotenv';
import './mqtt/mqttClient.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// conexion a  base de datos
connectDB();

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());
app.use(cookieParser()); 

// enrutado
app.use('/api/auth', userRoutes);
app.use('/api/sensores',sensorRoutes );

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
