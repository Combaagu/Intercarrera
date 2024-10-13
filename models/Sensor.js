// import mongoose from 'mongoose';

// const sensorSchema = new mongoose.Schema({
//     luz: {
//         type: Number,
//         required: true,
//     },
//     temperatura: {
//         type: Number,
//         required: true,
//     },
//     humedad: {
//         type: Number,
//         required: true,
//     },
// }, { timestamps: true });

// const Sensor = mongoose.model('Sensor', sensorSchema);
// export default Sensor;



// models/Sensor.js
import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema({
    estado: { type: String, required: true },
    razon: { type: String, required: true },
    detalles: {
        luz: { type: Number, required: true },
        temperatura: { type: Number, required: true },
        humedad: { type: Number, required: true },
    },
}, { timestamps: true });

const Sensor = mongoose.model('Sensor', sensorSchema);
export default Sensor;
