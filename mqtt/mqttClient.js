import mqtt from 'mqtt';
import { saveSensorData } from '../controllers/sensorController.js';
import { getIO } from '../socket.js';
import { determinarEstadoMascota } from './logicaMascota.js'; // Importamos la lógica
import { ArgumentError } from 'jwks-rsa';

// Conexión MQTT
const client = mqtt.connect('mqtt://broker.emqx.io');

// Estado de hambre (0: tiene hambre, 1: está llena)
let hambre = 1; // Inicialmente la mascota está llena
let esperandoAlimentacion = false; // Bandera para saber si la mascota está esperando ser alimentada

// Estado de sueño (0: no tiene sueño, 1: tiene sueño)
let sueño = 1; // Inicialmente la mascota no tiene sueño
let sueñoTimer;
let esperandoSueño = false;

let triste = 0;
let feliz = 1;

// Variables para los últimos datos de sensores
let ultimaTemperatura = 0
let ultimaHumedad = 0
let ultimaLuz = 0

client.on('connect', () => {
    client.subscribe('toMQTT', (err) => {
        if (err) console.error('Error al suscribirse al topic toMQTT:', err);
        else {
            console.log('Suscrito al topic toMQTT');
            // iniciarTimerSueño(); // Iniciar el temporizador de sueño
        }
    });
});

client.on('message', (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        const io = getIO();

        console.log("Datos recibidos:", data);
        console.log("Estado actual: hambre =", hambre, ", sueño =", sueño, ", esperandoAlimentacion =", esperandoAlimentacion);

        //Verificar si la mascota está esperando ser alimentada
        if (esperandoAlimentacion) {
            if (data.hambre === 1) {
                // La mascota ha sido alimentada
                hambre = 1; // La mascota está llena
                esperandoAlimentacion = false; // Ya no espera más comida
                console.log("La mascota ha sido alimentada.");
                nivelHambre = 10
            } else {
                console.log("La mascota está esperando ser alimentada. No se procesan nuevos datos.");
                return; // Salir si está esperando alimentación y no se recibió hambre = 1
            }
        }

        if (esperandoSueño) {
            if (data.sueño === 1) {
                sueño = 1;
                esperandoSueño = false;
                console.log("La mascota tiene sueño.");
                nivelSueño = 10
            } else {
                return;
            }
        }
        // Procesamiento de datos de sensores (temperatura, humedad, luz) y hambre
        const temperatura = data.temperatura !== undefined ? data.temperatura : ultimaTemperatura;
        const humedad = data.humedad !== undefined ? data.humedad : ultimaHumedad;
        const luz = data.luz !== undefined ? data.luz : ultimaLuz;

        if (topic === 'toMQTT') {
            // Determinamos el estado de la mascota basado en los sensores y el hambre
            const estadoMascota = determinarEstadoMascota(temperatura, humedad, luz, hambre, sueño);

            // Creamos el objeto para guardar en la base de datos
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
            saveSensorData(datosAguardar);

            // Publicar todo el estado en MQTT
            client.publish('MQTTestado', JSON.stringify(estadoMascota), { retain: true });
            //io.emit('estadoMascota', estadoMascota); CAMBIO ACADWAD
            io.emit('datosAguardar', datosAguardar);
        }
    } catch (error) {
        console.error('Error al procesar el mensaje MQTT:', error);
    }
});

let nivelHambre = 10;
let nivelSueño = 0;
let nivelTriste = 8;
let nivelFeliz = 2;

function iniciarTimerHambre2() {

    setInterval(() => {
        if (nivelHambre > 0) {
            nivelHambre -= 1;
            console.log(`Hambre actual: ${nivelHambre}`);

            // Emitir el nuevo estado de hambre a través de WebSocket
            const io = getIO();
            io.emit('hambreEstado', { hambre: nivelHambre });

            if (nivelHambre == 0) {
                hambre = 0
                esperandoAlimentacion = true;
                console.log("entrooo")
                ///  const estadoMascota = determinarEstadoMascota(ultimaTemperatura, ultimaHumedad, ultimaLuz, hambre, sueño);
                const estadoMascota = { hambre: 0 }
                console.log(estadoMascota)
                client.publish('MQTTestado', JSON.stringify(estadoMascota), { retain: true });
            }
        }
    }, 2000);
}

client.on('connect', () => {
    client.subscribe('toMQTT', (err) => {
        if (err) console.error('Error al suscribirse al topic toMQTT:', err);
        else {
            console.log('Suscrito al topic toMQTT');
            iniciarTimerHambre2(); // Iniciar el temporizador de hambre
            iniciarTimerSueño2()
            iniciarTimerHumor()
        }
    });
});

client.on('connect', () => {
    const io = getIO();
    io.on('connection', (socket) => {
        console.log('Cliente conectado');

        // Escuchar el evento 'actualizarHambre'
        socket.on('actualizarHambre', (nuevoHambre) => {
            if (nuevoHambre >= 0 && nuevoHambre <= 10) {
                nivelHambre = nuevoHambre; // Actualiza el nivel de hambre
                console.log(`Nuevo nivel de hambre recibido: ${nivelHambre}`);
              
                // Emitir el estado actualizado a todos los clientes
                io.emit('hambreEstado', { hambre: nivelHambre });

                let bitSueño = nivelSueño < 10 ? 1 : 0;
                const estadoMascota = {
                    'sueño': bitSueño,
                    hambre : 1
                };
                console.log(estadoMascota)
                client.publish('MQTTestado', JSON.stringify(estadoMascota), { retain: true });
            }
        });
    });
});

//FUNCION SUEÑO
function iniciarTimerSueño2() {

    setInterval(() => {
        if (nivelSueño < 10) {
            nivelSueño += 1;
            console.log(`Sueño actual: ${nivelSueño}`);

            // Emitir el nuevo estado de hambre a través de WebSocket
            const io = getIO();
            io.emit('SueñoEstado', { sueño: nivelSueño });

            if (nivelSueño == 10) {
                console.log("entrooo")
                esperandoSueño = true
                const estadoMascota = {
                    'sueño': 0
                };
                console.log(estadoMascota)
                client.publish('MQTTestado', JSON.stringify(estadoMascota), { retain: true });
            }
        }
    }, 2000);
}

client.on('connect', () => {
    const io = getIO();
    io.on('connection', (socket) => {
        console.log('Cliente conectado');

        socket.on('actualizarSueño', (nuevoSueño) => {
            if (nuevoSueño >= 0 && nuevoSueño <= 10) {
                nivelSueño = nuevoSueño;
                console.log(`Nuevo nivel de sueño recibido: ${nuevoSueño}`);
                let bitHambre = nivelHambre < 10 ? 1 : 0;
                const estadoMascota = {
                    'sueño': 1,
                    hambre : bitHambre
                };
                console.log(estadoMascota)
                client.publish('MQTTestado', JSON.stringify(estadoMascota), { retain: true });
                io.emit('sueñoEstado', { sueño: nuevoSueño });
            }
        });
    });
});


//FUNCION DEL HUMOR

function iniciarTimerHumor() {
    setInterval(() => {
        if (nivelSueño === 10 && nivelHambre === 0 && nivelFeliz != 0 && nivelTriste != 10) {
            nivelTriste += 1;
            nivelFeliz -= 1;

            const io = getIO();
            // Combina ambos estados en un solo objeto
            io.emit('humorEstado', { triste: nivelTriste, feliz: nivelFeliz });
        }
        if (nivelFeliz == 0 && nivelTriste == 10) {
            const estadoMascota = {
                muerte: 0
              }
              
            console.log(estadoMascota)
            client.publish('MQTTestado', JSON.stringify(estadoMascota), { retain: true });
        }
    }, 2000);
}
