import { Router } from 'express';
import { checkAuth } from '../../common/middlewares/auth.middleware.js';
import { checkRole } from '../../common/middlewares/role.middleware.js';
import { validate } from '../../common/middlewares/validator.middleware.js';
import { AsignacionController } from './asignacion.controller.js';
import { createAsignacionSchema, updateAsistenciaSchema, changeEstadoSchema, reporteSchema } from './schemas/asignacion.schemas.js';

import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const controller = new AsignacionController();

// Configurar Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/evidencias';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `evidencia-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB límite
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'));
    }
  }
});

// 1. REPORTE ADMIN (Solo Rol 1)
router.get(
  '/reporte',
  checkAuth,
  checkRole([1]),
  validate(reporteSchema), // Valida Query Params (inicio, fin)
  controller.verReporteAdmin
);

// 2. OPERATIVA (Admin y Encargado - Roles 1 y 2)
router.post(
  '/',
  checkAuth,
  checkRole([1, 2]), // Admin y Encargado
  validate(createAsignacionSchema),
  controller.crearAsignacion
);

router.put(
  '/asistencia',
  checkAuth,
  checkRole([1, 2]), // Admin y Encargado
  validate(updateAsistenciaSchema),
  controller.marcarAsistencia
);

router.patch(
  '/:id/estado',
  checkAuth,
  checkRole([1, 2]), // Admin y Encargado
  validate(changeEstadoSchema),
  controller.cambiarEstado
);

// Nueva ruta para subir evidencia (PDF y Texto Extra)
router.patch(
  '/:id/evidencia',
  checkAuth,
  checkRole([1, 2]),
  upload.single('pdf'),
  controller.subirEvidencia
);

// 3. CONSULTA (Rol 1 y 2)
router.get('/:id', checkAuth, checkRole([1, 2]), controller.getAsignacion);
router.get('/', checkAuth, checkRole([1, 2]), controller.getTodasLasAsignaciones);

export default router;