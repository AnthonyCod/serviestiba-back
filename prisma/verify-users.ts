import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function verificarUsuarios() {
    console.log('🔍 Verificando usuarios en la base de datos...\n');

    const usuarios = await prisma.usuario.findMany({
        include: {
            persona: true,
            rol: true,
        },
    });

    console.log(`📊 Total de usuarios: ${usuarios.length}\n`);

    for (const user of usuarios) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📧 Email: ${user.email}`);
        console.log(`👤 Nombre: ${user.persona?.nombre} ${user.persona?.apellido}`);
        console.log(`🎭 Rol: ${user.rol.nombre}`);
        console.log(`🔒 Hash: ${user.contrasena.substring(0, 30)}...`);

        // Probar la contraseña "123456"
        const testPassword = '123456';
        const isValid = await bcrypt.compare(testPassword, user.contrasena);

        console.log(`✅ ¿Contraseña "${testPassword}" válida?: ${isValid ? '✅ SÍ' : '❌ NO'}`);
        console.log('');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔐 Probando login manual...\n');

    // Probar login con encargado
    const encargado = usuarios.find(u => u.email === 'encargado@serviestiba.com');
    if (encargado) {
        const testPass = '123456';
        const result = await bcrypt.compare(testPass, encargado.contrasena);
        console.log(`📧 Email: encargado@serviestiba.com`);
        console.log(`🔑 Password: ${testPass}`);
        console.log(`🔒 Hash en BD: ${encargado.contrasena}`);
        console.log(`✅ Resultado: ${result ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
    }

    await prisma.$disconnect();
}

verificarUsuarios().catch(console.error);
