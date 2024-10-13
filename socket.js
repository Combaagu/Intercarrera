// import { Server } from 'socket.io';

// let io;

// export const initSocketIO = (server) => {
//     io = new Server(server, {
//         cors: {
//             origin: '*',  // Permitir cualquier origen (puedes ajustarlo según las necesidades)
//             methods: ['GET', 'POST']
//         }
//     });

//     io.on('connection', (socket) => {
//         console.log('Un cliente se ha conectado:', socket.id);
//         socket.on('disconnect', () => {
//             console.log('Cliente desconectado:', socket.id);
//         });
//     });
// };

// export const getIO = () => {
//     if (!io) {
//         throw new Error('Socket.io no está inicializado');
//     }
//     return io;
// };

import { Server } from 'socket.io';

let io;

export const initIO = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*',  // Permitir que cualquier origen se conecte, ajusta según tu caso
            methods: ['GET', 'POST']
        }
    });
    
    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado:', socket.id);

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });
    
    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO no está inicializado');
    }
    return io;
};
