import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function actualizarContrasenas() {
    console.log('🔧 Actualizando contraseñas de TODOS los usuarios a "123456"...\n');

    const nuevaPassword = '123456';
    const hash = await bcrypt.hash(nuevaPassword, 10);

    console.log(`🔒 Nuevo hash generado: ${hash.substring(0, 30)}...\n`);

    // Obtener todos los usuarios
    const usuarios = await prisma.usuario.findMany({
        include: {
            persona: true,
            rol: true,
        },
    });

    console.log(`📊 Total de usuarios a actualizar: ${usuarios.length}\n`);

    // Actualizar cada usuario
    for (const user of usuarios) {
        await prisma.usuario.update({
            where: { id: user.id },
            data: { contrasena: hash },
        });

        console.log(`✅ Actualizado: ${user.email} (${user.rol.nombre})`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 ¡Todas las contraseñas actualizadas!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📧 Ahora TODOS los usuarios tienen:');
    console.log('   Password: 123456\n');

    // Verificar
    console.log('🔍 Verificando...\n');
    const testUser = usuarios[0];
    const isValid = await bcrypt.compare(nuevaPassword, hash);
    console.log(`✅ Test de verificación: ${isValid ? '✅ CORRECTO' : '❌ ERROR'}\n`);

    await prisma.$disconnect();
}

actualizarContrasenas().catch(console.error);
