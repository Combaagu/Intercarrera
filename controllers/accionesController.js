// Endpoint para alimentar a la mascota
import { getIO } from '../socket.js'

export const accionBtn = (req, res) => {
    // Emitir el mensaje 'Alimentado 1' a todos los clientes conectados
    const io = getIO();
    io.emit('alimentado', { message: 'Alimentado 1' }); // Emitir solo el mensaje "Alimentado 1"

    console.log("DEL BACK alimentado = 1"); // Mostrar en consola

    return res.status(200).json({ message: 'Alimentado 1' }); // Respuesta a la petición HTTP
};

