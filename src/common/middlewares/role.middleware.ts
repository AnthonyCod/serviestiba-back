import type { Response, NextFunction } from 'express';
import type { RequestExt } from './auth.middleware.js'; // Importamos tu interfaz extendida

/**
 * @param rolesPermitidos Array de IDs de roles (Ej: [1, 2])
 */
export const checkRole = (rolesPermitidos: number[]) => (req: RequestExt, res: Response, next: NextFunction) => {
  try {
    const usuario = req.user; // Esto viene del token gracias a checkAuth

    if (!usuario) {
      res.status(401).json({ error: 'Usuario no identificado' });
      return; 
    }

    // Verificamos si el rol del usuario está en la lista permitida
    if (!rolesPermitidos.includes(usuario.fk_rol)) {
      res.status(403).json({ error: 'ACCESO DENEGADO: No tienes el rol necesario para esta acción.' });
      return;
    }

    next(); // Si tiene el rol, pasa
  } catch (e) {
    res.status(403).json({ error: 'Error verificando permisos' });
  }
};