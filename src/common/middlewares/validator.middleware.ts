import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { ZodType } from 'zod';

export const validate = (schema: ZodType) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    // 1. Verificamos si es una instancia de ZodError
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Datos inválidos',
        errors: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    next(error);
  }
};