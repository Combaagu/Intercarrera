// // index.js
// import express from 'express';
// import connectDB from './database/db.js';
// import cookieParser from 'cookie-parser';
// import sensorRoutes from './routes/sensorRoutes.js';
// import userRoutes from './routes/authRoutes.js'; 
// import dotenv from 'dotenv';
// import './mqtt/mqttClient.js';


// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // conexion a  base de datos
// connectDB();

// // Middleware para parsear el cuerpo de las solicitudes
// app.use(express.json());
// app.use(cookieParser()); 

// // enrutado
// app.use('/api/auth', userRoutes);
// app.use('/api/sensores',sensorRoutes );

// // Inicia el servidor
// app.listen(PORT, () => {
//     console.log(`Servidor corriendo en el puerto ${PORT}`);
// });
import express from 'express';
import connectDB from './database/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';  // Importa cors
import sensorRoutes from './routes/sensorRoutes.js';
import userRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import { initIO } from './socket.js';
import './mqtt/mqttClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a la base de datos
connectDB();

// Middleware
app.use(cors({
    origin: `http://localhost:${PORT}`,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/auth', userRoutes);
app.use('/api/sensores', sensorRoutes);

// Inicia el servidor HTTP
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Inicializa WebSocket
initIO(server);