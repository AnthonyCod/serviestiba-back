import type { Request, Response } from 'express';
import { loginUser } from './auth.service.js';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const response = await loginUser({ email, password });

    if (response === 'NOT_FOUND' || response === 'WRONG_PASS') {
      res.status(403).json({ error: 'Credenciales incorrectas' });
      return;
    }

    res.json(response);
  } catch (e) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};