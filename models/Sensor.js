import mongoose from 'mongoose';


const estadoSchema = new mongoose.Schema({
  feliz: { type: Number, required: true },
  triste: { type: Number, required: true },
  sueño: { type: Number, required: true },
  hambre: { type: Number, required: true },
  temperaturaEstado: { type: Number, required: true },
  humedadEstado: { type: Number, required: true },
  luzEstado: { type: Number, required: true }
});

// Esquema principal del sensor
const sensorSchema = new mongoose.Schema({
  estado: { type: estadoSchema, required: true }, 
  razon: { type: String, required: true }, 
  detalles: { 
    luz: { type: Number, required: true },
    temperatura: { type: Number, required: true },
    humedad: { type: Number, required: true }
  }
}, { timestamps: true }); 

const Sensor = mongoose.model('Sensor', sensorSchema);
export default Sensor;
