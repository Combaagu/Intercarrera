import express from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/authController.js';
import verificarToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta para registrar usuario
router.post('/registro', registrarUsuario);

// Ruta para login usuario
router.post('/login', loginUsuario);

// Ruta de ejemplo para ver Id en postman
router.get('/', verificarToken, (req, res) => {
    res.json({ usuarioId: req.usuarioId});
});

export default router;
