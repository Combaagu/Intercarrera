const mqtt = require('mqtt');

// Cambia esto por la URL de tu broker MQTT
const url = 'mqtt://broker.emqx.io'; // Por ejemplo, para un broker local

// Conectar al broker
const client = mqtt.connect(url);

client.on('connect', () => {
    console.log('Conectado al broker MQTT');

    // Suscribirse a un tópico
    const topic = 'toMQTT';
    client.subscribe(topic, (err) => {
        if (err) {
            console.error('Error al suscribirse:', err);
        } else {
            console.log(`Suscrito al tópico: ${topic}`);
        }
    });

    // Publicar un mensaje
    const mensaje = 'Hola, MQTT!';
    client.publish(topic, mensaje, (err) => {
        if (err) {
            console.error('Error al publicar el mensaje:', err);
        } else {
            console.log(`Mensaje enviado: ${mensaje}`);
        }
    });
});

// Manejar la recepción de mensajes
client.on('message', (topic, message) => {
    console.log(`Mensaje recibido en ${topic}: ${message.toString()}`);
});

// Manejo de errores
client.on('error', (err) => {
    console.error('Error de conexión:', err);
});
