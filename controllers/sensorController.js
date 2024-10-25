import Sensor from '../models/Sensor.js';


export const saveSensorData = async (data) => {
    try {

        const sensorData = new Sensor({
            estado: data.estado, 
            razon: data.razon,
            detalles: {
                luz: data.detalles.luz,  
                temperatura: data.detalles.temperatura,  
                humedad: data.detalles.humedad,  
            },
        });

        // Guardar el objeto en la base de datos
        await sensorData.save();

        console.log('Datos guardados en la base de datos:', sensorData);

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


export const getSensorDataLast = async (req, res) => {
    try {
        const lastData = await Sensor.findOne().sort({ createdAt: -1 }); // Obtiene el último registro por la fecha de creación

        if (!lastData) {
            return res.status(404).json({ message: 'No se encontraron datos del sensor.' });
        }

        res.json(lastData);

    } catch (error) {
        console.error('Error al obtener los datos del sensor:', error);
        res.status(500).json({ message: 'Error al obtener los datos del sensor.' });
    }
};