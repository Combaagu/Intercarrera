import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const conectarDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB conectado correctamente');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1);// sale del bucle
    }
};

export default conectarDB;
