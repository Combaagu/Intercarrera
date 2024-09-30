const mqtt = require('mqtt');

// Cambia esto por la URL de tu broker MQTT
const url = 'mqtt://broker.emqx.io'; // Si tu broker está en el mismo servidor

// Conectar al broker
const client = mqtt.connect(url);

client.on('connect', () => {
    console.log('Conectado al broker MQTT');

    // Tópico al que se va a publicar
    const topic = 'toMQTT2';

    // Mensaje a enviar
    const mensaje = 'Hola desde mi servidor!';

    // Publicar el mensaje
    client.publish(topic, mensaje, (err) => {
        if (err) {
            console.error('Error al publicar el mensaje:', err);
        } else {
            console.log(`Mensaje enviado: ${mensaje}`);
        }

        // Cerrar la conexión después de enviar el mensaje
        client.end();
    });
});

// Manejo de errores
client.on('error', (err) => {
    console.error('Error de conexión:', err);
});
