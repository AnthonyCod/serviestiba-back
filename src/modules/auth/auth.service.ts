import prisma from '../../config/prisma.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../common/utils/jwt.handle.js';
import { LoginDto } from './dtos/auth.dto.js';

export class AuthService {

  async login(data: LoginDto) {
    console.log("------------------------------------------------");
    console.log("🔍 INTENTO DE LOGIN:");
    console.log("📧 Email recibido:", data.email);
    console.log("🔑 Password recibido:", data.password);

    // 1. Buscar usuario
    const user = await prisma.usuario.findUnique({
      where: { email: data.email },
      include: { persona: true, rol: true }
    });

    if (!user) {
      console.log("❌ ERROR: El usuario NO existe en la BD.");
      throw new Error('INVALID_CREDENTIALS');
    }

    console.log("✅ Usuario encontrado:", user.email);
    console.log("🔒 Hash en BD:", user.contrasena);

    // 2. Comparar contraseñas
    const isCorrect = await bcrypt.compare(data.password, user.contrasena);

    console.log("⚖️ ¿Contraseña válida?:", isCorrect);
    console.log("------------------------------------------------");

    if (!isCorrect) {
      console.log("❌ ERROR: Contraseña incorrecta.");
      throw new Error('INVALID_CREDENTIALS');
    }

    // 3. Generar token
    const token = generateToken({ id: user.id, fk_rol: user.fk_rol });

    // 4. Limpiar password antes de enviarlo
    const { contrasena, ...userWithoutPass } = user;

    const response = { token, user: userWithoutPass };
    console.log("✅ LOGIN EXITOSO - Enviando respuesta:");
    console.log("📦 Token generado:", token.substring(0, 20) + "...");
    console.log("👤 Usuario:", userWithoutPass.email);
    console.log("------------------------------------------------");

    return response;
  }
}