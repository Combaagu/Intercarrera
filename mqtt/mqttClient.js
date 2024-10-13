// import mqtt from 'mqtt';
// import { saveSensorData } from '../controllers/sensorController.js'; 
// import { getIO } from '../socket.js';  // Importa la instancia de socket

// // Conexión al broker MQTT
// const client = mqtt.connect('mqtt://broker.emqx.io');

// client.on('connect', () => {
//     // console.log('Conectado al broker MQTT');

//     // Suscripción a los tópicos
//     client.subscribe('toMQTT', (err) => {
//         if (err) {
//             console.error('Error al suscribirse al topic toMQTT:', err);
//         } else {
//             console.log('Suscrito al topic toMQTT');
//         }
//     });

//     client.subscribe('MQTTestado', (err) => {
//         if (err) {
//             console.error('Error al suscribirse al topic MQTTestado:', err);
//         } else {
//             console.log('Suscrito al topic MQTTestado');
//         }
//     });
// });

// // Procesamiento de mensajes recibidos
// client.on('message', (topic, message) => {
//     try {
//         const data = JSON.parse(message.toString());
//         // console.log(`Datos recibidos en ${topic}:`, data);

//         // Procesar datos recibidos del topic toMQTT
//         if (topic === 'toMQTT') {

//             saveSensorData(data);  // Guarda los datos en la base de datos

//             // publica en el tópico MQTTestado
//             const sensorData = {
//                 luz: data.luz ,
//                 temperatura: data.temperatura,
//                 humedad: data.humedad 
//             };

//             client.publish('MQTTestado', JSON.stringify(sensorData), (err) => {
//                 if (err) {
//                     console.error('Error al publicar los datos en MQTTestado:', err);
//                 } else {
//                     console.log('Datos publicados en MQTTestado:', sensorData);
//                 }
//             });
//         }

//         // Emitir datos a los clientes conectados WS
//         if (topic === 'MQTTestado') {
//             const io = getIO();
//             io.emit('estado', data);  // Envía datos a todos los clientes
//             console.log('Estado enviado a los clientes vía WebSocket');
            
//         }

//     } catch (error) {
//         console.error('Error al procesar el mensaje MQTT:', error);
//     }
// });

// client.on('message', (topic, message) => {
//     try {
//         const data = JSON.parse(message.toString());
//         const io = getIO();

//         if (topic === 'toMQTT') {
//             saveSensorData(data);
//         }

//         if (topic === 'MQTTestado') {
//             const estado = determinarEstadoMascota(data.temperatura, data.humedad, data.luz);
//             io.emit('estadoMascota', estado);  // Enviar el estado a todos los clientes
//             console.log('Estado de la mascota enviado:', estado);
//         }

//     } catch (error) {
//         console.error('Error al procesar el mensaje MQTT:', error);
//     }
// });


// mqttClient.js
import mqtt from 'mqtt';
import { saveSensorData } from '../controllers/sensorController.js'; 
import { getIO } from '../socket.js';  

// Conexión MQTT
const client = mqtt.connect('mqtt://broker.emqx.io');

// Definir la lógica del comportamiento de la mascota
function determinarEstadoMascota(temperatura, humedad, luz) {
    let estado = {
        temperatura: '',
        humedad: '',
        luz: '',
        comportamiento: ''
    };

    // Determinar el estado según la temperatura
    if (temperatura < 15) {
        estado.temperatura = 'frío';
    } else if (temperatura >= 16 && temperatura <= 28) {
        estado.temperatura = 'óptimo';
    } else {
        estado.temperatura = 'calor extremo';
    }

    // Determinar el estado según la humedad
    if (humedad < 30) {
        estado.humedad = 'seca';
    } else if (humedad >= 31 && humedad <= 60) {
        estado.humedad = 'óptima';
    } else {
        estado.humedad = 'húmeda';
    }

    // Determinar el estado según la luz
    if (luz < 20) {
        estado.luz = 'poca luz';
    } else if (luz >= 21 && luz <= 70) {
        estado.luz = 'luz moderada';
    } else {
        estado.luz = 'luz intensa';
    }

    // Definir el comportamiento
    if (estado.temperatura === 'frío' && estado.humedad === 'seca') {
        estado.comportamiento = 'La mascota tiembla y busca calor.';
    } else if (estado.temperatura === 'óptimo' && estado.humedad === 'óptima' && estado.luz === 'luz moderada') {
        estado.comportamiento = 'La mascota está activa y feliz.';
    } else if (estado.temperatura === 'calor extremo' || estado.humedad === 'húmeda') {
        estado.comportamiento = 'La mascota está incómoda y busca sombra.';
    } else {
        estado.comportamiento = 'La mascota está en un estado neutro.';
    }

    return estado;
}

client.on('connect', () => {
    client.subscribe('toMQTT', (err) => {
        if (err) {
            console.error('Error al suscribirse al topic:', err);
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

client.on('message', (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        const io = getIO();

        if (topic === 'toMQTT') {
            // Determinar el estado de la mascota
            const estadoMascota = determinarEstadoMascota(data.temperatura, data.humedad, data.luz);

            // Crear el objeto en el formato deseado
            const datosAguardar = {
                estado: estadoMascota.comportamiento, // Asumiendo que comportamiento es el estado
                razon: estadoMascota.comportamiento.includes('incómoda') 
                        ? 'La temperatura está fuera de los rangos óptimos.' 
                        : 'La mascota está en un estado óptimo.',
                detalles: {
                    luz: data.luz,
                    temperatura: data.temperatura,
                    humedad: data.humedad
                }
            };

            // Guardar el nuevo objeto en la base de datos
            saveSensorData(datosAguardar);
        }

        if (topic === 'MQTTestado') {
            const estado = determinarEstadoMascota(data.temperatura, data.humedad, data.luz);
            io.emit('estadoMascota', estado);  // Enviar el estado a todos los clientes
            console.log('Estado de la mascota enviado:', estado);
        }

    } catch (error) {
        console.error('Error al procesar el mensaje MQTT:', error);
    }
});
