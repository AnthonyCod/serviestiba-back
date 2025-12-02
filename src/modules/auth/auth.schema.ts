import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener mínimo 6 caracteres" })
});