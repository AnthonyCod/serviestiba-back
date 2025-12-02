import prisma from '../../config/prisma.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../common/utils/jwt.handle.js';

export const loginUser = async ({ email, password }: any) => {
  // 1. Buscar
  const user = await prisma.usuario.findUnique({
    where: { email },
    include: { persona: true, rol: true } // Datos extra para el front
  });

  if (!user) return 'NOT_FOUND';

  // 2. Verificar password
  const isCorrect = await bcrypt.compare(password, user.contrasena);
  if (!isCorrect) return 'WRONG_PASS';

  // 3. Generar token
const token = generateToken({ id: user.id, fk_rol: user.fk_rol });
  
  // 4. Limpiar respuesta (quitar password)
  const { contrasena, ...userData } = user;

  return { token, user: userData };
};