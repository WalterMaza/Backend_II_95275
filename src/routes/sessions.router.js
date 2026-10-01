import { Router } from 'express';
import { login, register, current, logout } from '../controllers/sessions.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas públicas (no requieren autenticación)
router.post('/register', register);
router.post('/login', login);


// Ruta protegida
// Solo se accede al controller si el usuario esta autenticado
// la protección la proporciona la función authMiddleware
router.get('/current', authMiddleware, current);

// Cierre de sesión
router.post('/logout', logout);

export default router;
