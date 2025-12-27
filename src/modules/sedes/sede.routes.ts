import { Router } from 'express';
import { checkAuth } from '../../common/middlewares/auth.middleware.js';
import { SedeController } from './sede.controller.js';

const router = Router();
const controller = new SedeController();

// Rutas protegidas
router.get('/', checkAuth, controller.getSedes);
router.get('/:id', checkAuth, controller.getSedeById);

export default router;
