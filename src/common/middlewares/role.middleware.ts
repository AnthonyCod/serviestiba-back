import type { Response, NextFunction } from 'express';
import type { RequestExt } from './auth.middleware.js';

/**
 * @param rolesPermitidos Array de IDs de roles (Ej: [1, 2])
 */
export const checkRole = (rolesPermitidos: number[]) => (
  req: RequestExt, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const usuario = req.user;

    // Aunque checkAuth se ejecute antes, validamos por seguridad defensiva
    if (!usuario) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return; 
    }

    // Verificamos si el rol del usuario está en la lista permitida
    if (!rolesPermitidos.includes(usuario.fk_rol)) {
      res.status(403).json({ 
        error: 'ACCESO DENEGADO: No tienes permisos suficientes para realizar esta acción.' 
      });
      return;
    }

    next();
  } catch (e) {
    res.status(500).json({ error: 'Error interno verificando permisos' });
  }
};