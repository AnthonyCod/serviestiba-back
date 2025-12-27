import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dtos/auth.dto.js';

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  // Usamos arrow function para mantener el contexto 'this'
  login = async (req: Request<unknown, unknown, LoginDto>, res: Response) => {
    try {
      const result = await this.service.login(req.body);
      res.json(result);
    } catch (error: any) {
      // Manejo de errores de negocio
      if (error.message === 'INVALID_CREDENTIALS') {
        res.status(401).json({ error: 'Credenciales incorrectas' });
      } else {
        // Error inesperado (BD caída, bug, etc.)
        console.error(error); // Es bueno loguear el error real en servidor
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  };
}