// import Usuario from '../models/User.js';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET; 


// // Registrar usuario
// export const registrarUsuario = async (req, res) => {
//     const { nombre, email, contraseña } = req.body;

//     try {
//         // verifica si el usuario ya existe
//         const usuarioExistente = await Usuario.findOne({ email });
//         if (usuarioExistente) {
//             return res.status(400).json({ mensaje: 'El usuario ya existe' });
//         }

//         const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);

//         //nuevo usuario
//         const nuevoUsuario = new Usuario({
//             nombre,
//             email,
//             contraseña: contraseñaEncriptada,
//         });

//         // guarda el usuario
//         await nuevoUsuario.save();
//         res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ mensaje: 'Error al registrar el usuario' });
//     }
// };

// //Login con JWT en cookie
// export const loginUsuario = async (req, res) => {
//     const { email, contraseña } = req.body;

//     const usuario = await Usuario.findOne({ email });
//     if (!usuario || !(await bcrypt.compare(contraseña, usuario.contraseña))) {
//         return res.status(401).json({ mensaje: 'Credenciales inválidas' });
//     }

//     const token = jwt.sign({ id: usuario._id }, JWT_SECRET, { expiresIn: '1h' });
    
//     // Configura el token como una cookie
//     res.cookie('token', token, { httpOnly: true}); // usar "secure: true" solo si utiliza HTTPS
//     res.json({ mensaje: 'Login exitoso', usuario: { id: usuario._id, email: usuario.email } });
// };
/*
import Usuario from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import expressJwt from 'express-jwt';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; 

// Middleware para verificar JWT de Auth0
const checkJwt = expressJwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience: process.env.API_IDENTIFIER,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
});

// Registrar usuario
export const registrarUsuario = async (req, res) => {
    const { nombre, email, contraseña } = req.body;

    try {
        // verifica si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }

        const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);

        //nuevo usuario
        const nuevoUsuario = new Usuario({
            nombre,
            email,
            contraseña: contraseñaEncriptada,
        });

        // guarda el usuario
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar el usuario' });
    }
};

// Login con JWT en cookie
export const loginUsuario = async (req, res) => {
    const { email, contraseña } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario || !(await bcrypt.compare(contraseña, usuario.contraseña))) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: usuario._id }, JWT_SECRET, { expiresIn: '1h' });
    
    // Configura el token como una cookie
    res.cookie('token', token, { httpOnly: true }); // usar "secure: true" solo si utiliza HTTPS
    res.json({ mensaje: 'Login exitoso', usuario: { id: usuario._id, email: usuario.email } });
};

// Proteger rutas con JWT de Auth0
export const protegerRuta = (req, res, next) => {
    checkJwt(req, res, next);
};

// Un ejemplo de una ruta protegida
export const rutaProtegida = (req, res) => {
    res.json({ mensaje: 'Acceso a ruta protegida exitoso', usuario: req.user });
};
*/
