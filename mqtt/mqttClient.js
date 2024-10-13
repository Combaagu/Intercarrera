// import mqtt from 'mqtt';
// import { saveSensorData } from '../controllers/sensorController.js'; 

// const client = mqtt.connect('mqtt://broker.emqx.io');

// client.on('connect', () => {
//     console.log('Conectado al broker MQTT ah');
//     client.subscribe('toMQTT', (err) => {
//         if (err) {
//             console.error('Error al suscribirse al topic:', err);
//         }
//     });
// });

// client.on('message', (topic, message) => {
//     try {
//         const data = JSON.parse(message.toString());
//         console.log('Datos recibidos:', data); // Asegúrate de que esto muestre los datos correctamente
//         saveSensorData(data);
//     } catch (error) {
//         console.error('Error al procesar el mensaje MQTT:', error);
//     }
// });


//------------------* VERISON V1 *-------------------

// import mqtt from 'mqtt';
// import { saveSensorData } from '../controllers/sensorController.js'; 

// const client = mqtt.connect('mqtt://broker.emqx.io');

// client.on('connect', () => {
//     console.log('Conectado al broker MQTT');
    
//     // Suscribirse al tópico del otro grupo
//     client.subscribe('toMQTT', (err) => {
//         if (err) {
//             console.error('Error al suscribirse al topic:', err);
//         }
//     });

//     // Publicar el estado inicial de la mascota
//     const initialState = { estado: 1 }; // Define un estado inicial

//     client.publish('toMQTTestado', JSON.stringify(initialState), (err) => {
//         if (err) {
//             console.error('Error al publicar el estado inicial:', err);
//         }
//     });
// });

// // Escuchar mensajes del tópico al que está suscrito
// client.on('message', (topic, message) => {
//     try {
//         const data = JSON.parse(message.toString());

//         console.log('Datos recibidos:', data); // datos recibidos
        
//         // guardar datos recibidos
//         saveSensorData(data);

//         // Lógica para determinar el estado de la mascota
//         let estadoMascota;
//         if (data.temperatura > 35) {
//             estadoMascota = { estado: 'calor' };
//         } else if (data.humedad > 70) {
//             estadoMascota = { estado: 'humedad alta' };
//         } else {
//             estadoMascota = { estado: 'normal' };
//         }

//         // Publicar el nuevo estado de la mascota
//         client.publish('toMQTTestado', JSON.stringify(estadoMascota), (err) => {
//             if (err) {
//                 console.error('Error al publicar el estado de la mascota:', err);
//             }
//         });
//     } catch (error) {
//         console.error('Error al procesar el mensaje MQTT:', error);
//     }
// });



// // mqttClient.js
// import mqtt from 'mqtt';
// import { saveSensorData } from '../controllers/sensorController.js';
// import { getSocketIO } from '../socket.js'; // Importar la instancia de Socket.IO

// const client = mqtt.connect('mqtt://broker.emqx.io');

// // unirme al topic del cliente para recibir datos
// client.on('connect', () => {
//     console.log('Conectado al broker MQTT');
//     client.subscribe('toMQTT', (err) => {
//         if (err) {
//             console.error('Error al suscribirse al topic:', err);
//         }
//     });
// });


// client.on('message', (topic, message) => {
//     try {
//         const data = JSON.parse(message.toString());
//         console.log('Datos recibidos del broker MQTT:', data);

//         // Guardar los datos en la base de datos
//         saveSensorData(data);

//         // Emitir los datos a todos los clientes conectados vía Socket.IO
//         const io = getSocketIO();
//         io.emit('actualizacion_estado_mascota', data);

//     } catch (error) {
//         console.error('Error al procesar el mensaje MQTT:', error);
//     }
// });

import mqtt from 'mqtt';
import { saveSensorData } from '../controllers/sensorController.js'; 
import { getIO } from '../socket.js';  // Importa la instancia de socket

// Conexión al broker MQTT
const client = mqtt.connect('mqtt://broker.emqx.io');

client.on('connect', () => {
    // console.log('Conectado al broker MQTT');

    // Suscripción a los tópicos
    client.subscribe('toMQTT', (err) => {
        if (err) {
            console.error('Error al suscribirse al topic toMQTT:', err);
        } else {
            console.log('Suscrito al topic toMQTT');
        }
    });

    client.subscribe('MQTTestado', (err) => {
        if (err) {
            console.error('Error al suscribirse al topic MQTTestado:', err);
        } else {
            console.log('Suscrito al topic MQTTestado');
        }
    });
});

// Procesamiento de mensajes recibidos
client.on('message', (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        // console.log(`Datos recibidos en ${topic}:`, data);

        // Procesar datos recibidos del topic toMQTT
        if (topic === 'toMQTT') {
            
            saveSensorData(data);  // Guarda los datos en la base de datos

            // publica en el tópico MQTTestado
            const sensorData = {
                luz: data.luz ,
                temperatura: data.temperatura,
                humedad: data.humedad 
            };

            client.publish('MQTTestado', JSON.stringify(sensorData), (err) => {
                if (err) {
                    console.error('Error al publicar los datos en MQTTestado:', err);
                } else {
                    console.log('Datos publicados en MQTTestado:', sensorData);
                }
            });
        }

        // Emitir datos a los clientes conectados WS
        if (topic === 'MQTTestado') {
            const io = getIO();
            io.emit('estado', data);  // Envía datos a todos los clientes
            console.log('Estado enviado a los clientes vía WebSocket');
            
        }

    } catch (error) {
        console.error('Error al procesar el mensaje MQTT:', error);
    }
});
