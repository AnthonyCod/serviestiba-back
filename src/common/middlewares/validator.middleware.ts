import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    // Intenta parsear el body con el esquema de Zod
    schema.parse(req.body);
    next();
  } catch (error: any) {
    // Si falla, devuelve error 400 con los detalles
    return res.status(400).json({ 
      error: 'Datos inválidos', 
      details: error.errors.map((e: any) => ({ field: e.path[0], message: e.message }))
    });
  }
};