import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validate } from '../../common/middlewares/validator.middleware.js';
import { loginSchema } from './schemas/auth.schema.js';

const router = Router();
const controller = new AuthController();

router.post(
  '/login', 
  validate(loginSchema), // 1. Valida estructura
  controller.login       // 2. Ejecuta lógica
);

export default router;