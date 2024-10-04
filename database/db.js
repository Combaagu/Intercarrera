// // db.js
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';  // Cargar variables de entorno

// dotenv.config();  // Cargar el archivo .env

// const MONGO_URI = process.env.MONGO_URI;

// const connectDB = async () => {
//     try {
//         await mongoose.connect(MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('MongoDB conectado correctamente');
//     } catch (error) {
//         console.error('Error conectando a MongoDB:', error.message);
//         process.exit(1);  // Finaliza el proceso en caso de error
//     }
// };

// export default connectDB;


import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();  // Cargar variables de entorno

const MONGO_URI = process.env.MONGO_URI;  // Leer desde .env

const conectarDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB conectado correctamente');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};

export default conectarDB;
