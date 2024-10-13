import Sensor from '../models/Sensor.js';

export const saveSensorData = async (data) => {

    // console.log('Datos recibidos:', data);


    try {
        const sensorData = new Sensor({
            luz: data.luz,  
            temperatura: data.temperatura,
            humedad: data.humedad,
        });

        await sensorData.save();

        console.log('datos guardados en mongo: ', sensorData);

    } catch (error) {
        console.error('Error al guardar los datos del sensor:', error);
    }
};


// Obtener todos los datos del sensor (historial)
export const getSensorData = async (req, res) => {
    try {

        const data = await Sensor.find().sort({ createdAt: -1 }); // Ordenado por la fecha de creacion

        res.json(data);

    } catch (error) {
        console.error('Error al obtener los datos del sensor:', error);
        res.status(500).json({ message: 'Error al obtener los datos del sensor.' });
    }
};
