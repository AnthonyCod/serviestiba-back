import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.handle.js'; 

export interface RequestExt extends Request {
  user?: any;
}

export const checkAuth = (req: RequestExt, res: Response, next: NextFunction) => {
  try {
    const tokenStr = req.headers.authorization;
    if (!tokenStr) {
      res.status(401).json({ error: 'Falta Token de sesión' });
      return;
    }

    const token = tokenStr.split(' ').pop() || '';
    const tokenData = verifyToken(token) as { id: number; fk_rol: number };

    if (!tokenData) {
      res.status(401).json({ error: 'Token inválido o expirado' });
      return;
    }

    req.user = tokenData;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Sesión no válida' });
  }
};