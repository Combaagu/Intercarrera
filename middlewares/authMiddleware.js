import jwt from 'jsonwebtoken';

const verificarToken = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ mensaje: 'Token no proporcionado' });
    }

    // verifica el token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: 'Token no válido' });
        }

        // si el token es valido, incorpora el usuario
        req.usuarioId = decoded.id;
        next();
    });
};

export default verificarToken;
