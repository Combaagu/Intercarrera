import mqtt from 'mqtt';
import { saveSensorData } from '../controllers/sensorController.js';
import { getIO } from '../socket.js';
import { determinarEstadoMascota } from './logicaMascota.js'; // Importamos la lógica

// Conexión MQTT
const client = mqtt.connect('mqtt://broker.emqx.io');

// Estado de hambre (0: tiene hambre, 1: está llena)
let hambre = 1; // Inicialmente la mascota está llena
let hambreTimer;
let esperandoAlimentacion = false; // Bandera para saber si la mascota está esperando ser alimentada

// Estado de sueño (0: no tiene sueño, 1: tiene sueño)
let sueño = 0; // Inicialmente la mascota no tiene sueño
let sueñoTimer;

// Variables para los últimos datos de sensores
let ultimaTemperatura, ultimaHumedad, ultimaLuz;

// Función para iniciar o reiniciar el temporizador de hambre
function iniciarTimerHambre() {
    if (hambreTimer) {
        clearTimeout(hambreTimer);
    }

    // Iniciar un temporizador de 30 segundos
    hambreTimer = setTimeout(() => {
        hambre = 0;
        esperandoAlimentacion = true;
        console.log("La mascota tiene hambre. Esperando a que el otro equipo le dé de comer.");

        // Determinamos el estado de la mascota en general (actualizamos hambre)
        const estadoMascota = determinarEstadoMascota(ultimaTemperatura, ultimaHumedad, ultimaLuz, hambre, sueño);

        // Publicar todo el estado en MQTT
        client.publish('MQTTestado', JSON.stringify(estadoMascota), { retain: true });
        
    }, 30000); // 30 segundos en milisegundos
}

//Función para iniciar o reiniciar el temporizador de sueño
function iniciarTimerSueño() {
    if (sueñoTimer) {
        clearTimeout(sueñoTimer);
    }

    // Iniciar un temporizador de 2 minutos (120000 milisegundos)
    sueñoTimer = setTimeout(() => {
        sueño = 1; // La mascota tiene sueño
        console.log("La mascota tiene sueño.");

        // Determinamos el estado de la mascota en general (actualizamos sueño)
        const estadoMascota = determinarEstadoMascota(ultimaTemperatura, ultimaHumedad, ultimaLuz, hambre, sueño);

        // Publicar todo el estado en MQTT
        client.publish('MQTTestado', JSON.stringify(estadoMascota), { retain: true });

    }, 120000); 
}

client.on('connect', () => {
    client.subscribe('toMQTT', (err) => {
        if (err) console.error('Error al suscribirse al topic toMQTT:', err);
        else {
            console.log('Suscrito al topic toMQTT');
            // iniciarTimerHambre(); // Iniciar el temporizador de hambre cuando se conecta
        }
    });
});

client.on('message', (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        const io = getIO();

        console.log("Datos recibidos:", data);
        console.log("Estado actual: hambre =", hambre, ", sueño =", sueño, ", esperandoAlimentacion =", esperandoAlimentacion);

        // Verificar si la mascota está esperando ser alimentada
        if (esperandoAlimentacion && data.hambre === 1) {
            // La mascota ha sido alimentada
            hambre = 1; // La mascota está llena
            esperandoAlimentacion = false; // Ya no espera más comida
            console.log("La mascota ha sido alimentada.");
            iniciarTimerHambre(); // Reiniciar el temporizador de hambre
        } else if (esperandoAlimentacion && data.hambre !== 1) {
            console.log("La mascota está esperando ser alimentada. No se procesan nuevos datos.");
            return; // Salir si está esperando alimentación y no se recibió hambre = 1
        }

        // Procesar datos de sensores
        const temperatura = data.temperatura !== undefined ? data.temperatura : ultimaTemperatura;
        const humedad = data.humedad !== undefined ? data.humedad : ultimaHumedad;
        const luz = data.luz !== undefined ? data.luz : ultimaLuz;

        // Verificar si tenemos todos los datos requeridos antes de guardar
        if (temperatura === undefined || humedad === undefined || luz === undefined) {
            console.error("Error: faltan datos de sensores. No se puede guardar en la base de datos.");
            return;
        }

        // Guardar los datos actuales para futuras referencias
        ultimaTemperatura = temperatura;
        ultimaHumedad = humedad;
        ultimaLuz = luz;

        // Determinar el estado de la mascota basado en los sensores y el hambre
        const estadoMascota = determinarEstadoMascota(temperatura, humedad, luz, hambre, sueño);

        // Crear el objeto para guardar en la base de datos
        const datosAguardar = {
            estado: estadoMascota,
            detalles: {
                luz: luz,
                temperatura: temperatura,
                humedad: humedad
            },
            razon: "Datos de sensores recibidos o alimentación", // Una razón para el guardado
            hambre: hambre // Guardar el estado de hambre
        };

        // Guardar en base de datos
        saveSensorData(datosAguardar)
            .then(() => console.log("Datos guardados correctamente"))
            .catch(error => console.error("Error al guardar los datos del sensor:", error));

            // Publicar todo el estado en MQTT
            client.publish('MQTTestado', JSON.stringify(estadoMascota), { retain: true });
            io.emit('estadoMascota', estadoMascota);
        }
     catch (error) {
        console.error('Error al procesar el mensaje MQTT:', error);
    }
});


// import express from 'express';
// import mqtt from 'mqtt';
// import { saveSensorData } from '../controllers/sensorController.js';
// import { getIO } from '../socket.js';
// import { determinarEstadoMascota } from './logicaMascota.js'; // Importamos la lógica

// const app = express();
// app.use(express.json());

// // Conexión MQTT
// const client = mqtt.connect('mqtt://broker.emqx.io');

// // Estado de hambre (0: tiene hambre, 1: está llena)
// let hambre = 1; // Inicialmente la mascota está llena
// let hambreTimer;
// let esperandoAlimentacion = false; // Bandera para saber si la mascota está esperando ser alimentada

// // Estado de sueño (0: no tiene sueño, 1: tiene sueño)
// let sueño = 0; // Inicialmente la mascota no tiene sueño
// let sueñoTimer;

// // Variables para los últimos datos de sensores
// let ultimaTemperatura, ultimaHumedad, ultimaLuz;

// // Función para iniciar o reiniciar el temporizador de hambre
// // function iniciarTimerHambre() {
// //     if (hambreTimer) {
// //         clearTimeout(hambreTimer);
// //     }

// //     hambreTimer = setTimeout(() => {
// //         hambre = 0;
// //         esperandoAlimentacion = true;
// //         console.log("La mascota tiene hambre. Esperando a que el otro equipo le dé de comer.");
        
// //         const estadoMascota = determinarEstadoMascota(ultimaTemperatura, ultimaHumedad, ultimaLuz, hambre, sueño);
// //         client.publish('MQTTestado', JSON.stringify(estadoMascota), { retain: true });
        
// //     }, 30000); // 30 segundos en milisegundos
// // }

// // Función para iniciar o reiniciar el temporizador de sueño
// // function iniciarTimerSueño() {
// //     if (sueñoTimer) {
// //         clearTimeout(sueñoTimer);
// //     }

// //     sueñoTimer = setTimeout(() => {
// //         sueño = 1; // La mascota tiene sueño
// //         console.log("La mascota tiene sueño.");

// //         const estadoMascota = determinarEstadoMascota(ultimaTemperatura, ultimaHumedad, ultimaLuz, hambre, sueño);
// //         client.publish('MQTTestado', JSON.stringify(estadoMascota), { retain: true });

// //     }, 120000); // 2 minutos en milisegundos
// // }

// client.on('connect', () => {
//     client.subscribe('toMQTT', (err) => {
//         if (err) console.error('Error al suscribirse al topic toMQTT:', err);
//         else {
//             console.log('Suscrito al topic toMQTT');
//             iniciarTimerHambre(); // Iniciar el temporizador de hambre cuando se conecta
//             iniciarTimerSueño(); // Iniciar el temporizador de sueño
//         }
//     });
// });

// client.on('message', (topic, message) => {
//     try {
//         const data = JSON.parse(message.toString());
//         const io = getIO();

//         console.log("Datos recibidos:", data);
//         console.log("Estado actual: hambre =", hambre, ", sueño =", sueño, ", esperandoAlimentacion =", esperandoAlimentacion);

//         // Lógica para procesar mensajes de MQTT
//         // (Aquí va la lógica que ya tienes para manejar el estado de la mascota)
        
//     } catch (error) {
//         console.error('Error al procesar el mensaje MQTT:', error);
//     }
// });
