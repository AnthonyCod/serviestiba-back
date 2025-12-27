import { Router } from 'express';
import { checkAuth } from '../../common/middlewares/auth.middleware.js';
import { checkRole } from '../../common/middlewares/role.middleware.js';
import { validate } from '../../common/middlewares/validator.middleware.js';
import { AsignacionController } from './asignacion.controller.js';
import { createAsignacionSchema,updateAsistenciaSchema,changeEstadoSchema,reporteSchema } from './schemas/asignacion.schemas.js';

const router = Router();
const controller = new AsignacionController();

// 1. REPORTE ADMIN (Solo Rol 1)
router.get(
  '/reporte', 
  checkAuth, 
  checkRole([1]), 
  validate(reporteSchema), // Valida Query Params (inicio, fin)
  controller.verReporteAdmin
);

// 2. OPERATIVA (Solo Rol 2 - Encargado)
router.post(
  '/', 
  checkAuth, 
  checkRole([2]), 
  validate(createAsignacionSchema), // Valida Body
  controller.crearAsignacion
);

router.put(
  '/asistencia', 
  checkAuth, 
  checkRole([2]), 
  validate(updateAsistenciaSchema), // Valida enum Asistencia
  controller.marcarAsistencia
);

router.patch(
  '/:id/estado', 
  checkAuth, 
  checkRole([2]), 
  validate(changeEstadoSchema), // Valida ID y enum Estado
  controller.cambiarEstado
);

// 3. CONSULTA (Rol 1 y 2)
router.get('/:id', checkAuth, checkRole([1, 2]), controller.getAsignacion);
router.get('/', checkAuth, checkRole([1, 2]), controller.getTodasLasAsignaciones);

export default router;