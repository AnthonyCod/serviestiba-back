import { Router } from 'express';
import { checkAuth } from '../../common/middlewares/auth.middleware.js';
import { PersonaController } from './persona.controller.js';

const router = Router();
const controller = new PersonaController();

// Rutas protegidas
router.get('/trabajadores', checkAuth, controller.getTrabajadores);
router.get('/:id', checkAuth, controller.getPersonaById);

export default router;
