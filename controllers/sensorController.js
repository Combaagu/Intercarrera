import Sensor from '../models/Sensor.js';

export const saveSensorData = async (data) => {
    try {
        const sensorData = new Sensor({
            luz: data.Luz, 
            temperatura: data.Temperatura,
            humedad: data.Humedad,
        });
        await sensorData.save();
        console.log('data del sensor guardados en la base de datos:', sensorData);
    } catch (error) {
        console.error('Error al guardar los datos del sensor:', error);
    }
};