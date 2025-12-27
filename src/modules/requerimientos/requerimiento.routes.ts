import { Router } from 'express';
import { checkAuth } from '../../common/middlewares/auth.middleware.js';
import { validate } from '../../common/middlewares/validator.middleware.js';
import { RequerimientoController } from './requerimiento.controller.js';
import { createRequerimientoSchema,getByIdSchema } from './schemas/requerimiento.schema.js';

const router = Router();
const controller = new RequerimientoController();

// Rutas protegidas y validadas

router.get(
  '/', 
  checkAuth, 
  controller.getRequerimientos
);

router.get(
  '/:id', 
  checkAuth, 
  validate(getByIdSchema), // Valida que ID sea numérico
  controller.getReqById
);

router.post(
  '/', 
  checkAuth, 
  validate(createRequerimientoSchema), // Valida el body completo
  controller.createRequerimiento
);

export default router;