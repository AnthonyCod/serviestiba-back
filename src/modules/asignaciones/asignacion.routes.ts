import { Router } from 'express';
import { checkAuth } from '../../common/middlewares/auth.middleware.js';
import { checkRole } from '../../common/middlewares/role.middleware.js';
import { 
  crearAsignacion, 
  marcarAsistencia, 
  getAsignacion, 
  getTodasLasAsignaciones, 
  cambiarEstado, 
  verReporteAdmin 
} from './asignacion.controller.js';

const router = Router();

// 1. REPORTE ADMIN (Solo Rol 1)
// Permite filtrar por Encargado y Estado
router.get('/reporte', checkAuth, checkRole([1]), verReporteAdmin);


// 2. OPERATIVA (Solo Rol 2 - Encargado)
router.post('/', checkAuth, checkRole([2]), crearAsignacion);
router.put('/asistencia', checkAuth, checkRole([2]), marcarAsistencia);
router.patch('/:id/estado', checkAuth, checkRole([2]), cambiarEstado);


// 3. CONSULTA (Rol 1 y 2)
router.get('/:id', checkAuth, checkRole([1, 2]), getAsignacion);
router.get('/', checkAuth, checkRole([1, 2]), getTodasLasAsignaciones);

export default router;