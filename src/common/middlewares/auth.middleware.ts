import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.handle.js';

// Exportamos la interfaz para usarla en Controllers: import { RequestExt } ...
export interface RequestExt extends Request {
  user?: {
    id: number;
    fk_rol: number;
    email?: string;
  };
}

export const checkAuth = (req: RequestExt, res: Response, next: NextFunction) => {
  try {
    const tokenStr = req.headers.authorization;
    
    if (!tokenStr) {
      res.status(401).json({ error: 'Falta Token de sesión' });
      return;
    }

    // Soporta formato "Bearer <token>" y "<token>"
    const token = tokenStr.split(' ').pop() || '';
    
    // Verificamos y casteamos el tipo de retorno
    const tokenData = verifyToken(token) as { id: number; fk_rol: number } | null;

    if (!tokenData) {
      res.status(401).json({ error: 'Token inválido o expirado' });
      return;
    }

    // Inyectamos el usuario en la request
    req.user = tokenData;
    next();
    
  } catch (e) {
    res.status(401).json({ error: 'Sesión no válida' });
  }
};