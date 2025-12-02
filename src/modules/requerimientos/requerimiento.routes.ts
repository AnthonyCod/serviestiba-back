import { Router } from 'express';
import { checkAuth } from '../../common/middlewares/auth.middleware.js';
import { 
  createRequerimiento, 
  getRequerimientos, 
  getReqById 
} from './requerimiento.controller.js';

const router = Router();

// Todas protegidas con checkAuth
router.get('/', checkAuth, getRequerimientos);
router.get('/:id', checkAuth, getReqById);
router.post('/', checkAuth, createRequerimiento);

export default router;