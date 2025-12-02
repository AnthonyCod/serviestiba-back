import { Router } from 'express';
import { login } from './auth.controller.js';
import { validate } from '../../common/middlewares/validator.middleware.js'; // Importar
import { loginSchema } from './auth.schema.js'; // Importar

const router = Router();
// Inyectamos validate(loginSchema) antes del controller
router.post('/login', validate(loginSchema), login); 

export default router;