import mqtt from 'mqtt';
import { saveSensorData } from '../controllers/sensorController.js'; 

const client = mqtt.connect('mqtt://broker.emqx.io');

client.on('connect', () => {
    console.log('Conectado al broker MQTT');
    client.subscribe('toMQTT', (err) => {
        if (err) {
            console.error('Error al suscribirse al topic:', err);
        }
    });
});

client.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    console.log('Datos recibidos:', data);
    
    //funcion del controlador
    saveSensorData(data);
});
