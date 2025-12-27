import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');

    // 1. Crear Roles
    console.log('📝 Creando roles...');
    const adminRole = await prisma.rol.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1, nombre: 'Admin' },
    });

    const encargadoRole = await prisma.rol.upsert({
        where: { id: 2 },
        update: {},
        create: { id: 2, nombre: 'Encargado' },
    });

    const trabajadorRole = await prisma.rol.upsert({
        where: { id: 3 },
        update: {},
        create: { id: 3, nombre: 'Trabajador' },
    });

    console.log('✅ Roles creados');

    // 2. Crear Usuarios con contraseñas hasheadas
    console.log('👥 Creando usuarios...');

    const passwordHash = await bcrypt.hash('123456', 10);

    // Usuario Admin
    const adminUser = await prisma.usuario.upsert({
        where: { email: 'admin@serviestiba.com' },
        update: {},
        create: {
            email: 'admin@serviestiba.com',
            contrasena: passwordHash,
            fk_rol: 1,
            estado: true,
        },
    });

    // Usuario Encargado
    const encargadoUser = await prisma.usuario.upsert({
        where: { email: 'encargado@serviestiba.com' },
        update: {},
        create: {
            email: 'encargado@serviestiba.com',
            contrasena: passwordHash,
            fk_rol: 2,
            estado: true,
        },
    });

    // Usuarios Trabajadores
    const trabajador1 = await prisma.usuario.upsert({
        where: { email: 'trabajador1@serviestiba.com' },
        update: {},
        create: {
            email: 'trabajador1@serviestiba.com',
            contrasena: passwordHash,
            fk_rol: 3,
            estado: true,
        },
    });

    const trabajador2 = await prisma.usuario.upsert({
        where: { email: 'trabajador2@serviestiba.com' },
        update: {},
        create: {
            email: 'trabajador2@serviestiba.com',
            contrasena: passwordHash,
            fk_rol: 3,
            estado: true,
        },
    });

    const trabajador3 = await prisma.usuario.upsert({
        where: { email: 'trabajador3@serviestiba.com' },
        update: {},
        create: {
            email: 'trabajador3@serviestiba.com',
            contrasena: passwordHash,
            fk_rol: 3,
            estado: true,
        },
    });

    console.log('✅ Usuarios creados');

    // 3. Crear Personas asociadas a usuarios
    console.log('👤 Creando personas...');

    await prisma.persona.upsert({
        where: { fk_usuario: adminUser.id },
        update: {},
        create: {
            fk_usuario: adminUser.id,
            nombre: 'Admin',
            apellido: 'Sistema',
            dni: '12345678',
            telefono: '999999999',
            fecha_nacimiento: new Date('1990-01-01'),
            distrito: 'Lima',
            capacidad: 'Ambos',
            imo: false,
            activo_empresa: true,
        },
    });

    await prisma.persona.upsert({
        where: { fk_usuario: encargadoUser.id },
        update: {},
        create: {
            fk_usuario: encargadoUser.id,
            nombre: 'Juan',
            apellido: 'Pérez',
            dni: '23456789',
            telefono: '987654321',
            fecha_nacimiento: new Date('1985-05-15'),
            distrito: 'Callao',
            capacidad: 'Ambos',
            imo: true,
            activo_empresa: true,
        },
    });

    await prisma.persona.upsert({
        where: { fk_usuario: trabajador1.id },
        update: {},
        create: {
            fk_usuario: trabajador1.id,
            nombre: 'Carlos',
            apellido: 'Gómez',
            dni: '34567890',
            telefono: '912345678',
            fecha_nacimiento: new Date('1992-08-20'),
            distrito: 'San Miguel',
            capacidad: 'Nestle',
            imo: false,
            activo_empresa: true,
        },
    });

    await prisma.persona.upsert({
        where: { fk_usuario: trabajador2.id },
        update: {},
        create: {
            fk_usuario: trabajador2.id,
            nombre: 'Luis',
            apellido: 'Ramos',
            dni: '45678901',
            telefono: '923456789',
            fecha_nacimiento: new Date('1988-03-10'),
            distrito: 'Los Olivos',
            capacidad: 'Molitalia',
            imo: true,
            activo_empresa: true,
        },
    });

    await prisma.persona.upsert({
        where: { fk_usuario: trabajador3.id },
        update: {},
        create: {
            fk_usuario: trabajador3.id,
            nombre: 'Ana',
            apellido: 'Torres',
            dni: '56789012',
            telefono: '934567890',
            fecha_nacimiento: new Date('1995-11-25'),
            distrito: 'Ventanilla',
            capacidad: 'Ambos',
            imo: false,
            activo_empresa: true,
        },
    });

    console.log('✅ Personas creadas');

    // 4. Crear Empresas
    console.log('🏢 Creando empresas...');

    const empresa1 = await prisma.empresa.upsert({
        where: { id: 1 },
        update: {},
        create: {
            razon_social: 'Nestlé Perú S.A.',
            ruc: '20100152356',
        },
    });

    const empresa2 = await prisma.empresa.upsert({
        where: { id: 2 },
        update: {},
        create: {
            razon_social: 'Alicorp S.A.A.',
            ruc: '20100055237',
        },
    });

    console.log('✅ Empresas creadas');

    // 5. Crear Sedes
    console.log('🏭 Creando sedes...');

    await prisma.sede.upsert({
        where: { id: 1 },
        update: {},
        create: {
            empresa_id: empresa1.id,
            nombre_sede: 'Sede Central - Callao',
            direccion: 'Av. Argentina 3093, Callao',
        },
    });

    await prisma.sede.upsert({
        where: { id: 2 },
        update: {},
        create: {
            empresa_id: empresa1.id,
            nombre_sede: 'Almacén Lurín',
            direccion: 'Km 40 Panamericana Sur, Lurín',
        },
    });

    await prisma.sede.upsert({
        where: { id: 3 },
        update: {},
        create: {
            empresa_id: empresa2.id,
            nombre_sede: 'Planta Callao',
            direccion: 'Av. Argentina 4793, Callao',
        },
    });

    console.log('✅ Sedes creadas');

    console.log('\n🎉 Seed completado exitosamente!\n');
    console.log('📧 Credenciales de prueba:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 ADMIN:');
    console.log('   Email: admin@serviestiba.com');
    console.log('   Password: 123456');
    console.log('');
    console.log('👔 ENCARGADO:');
    console.log('   Email: encargado@serviestiba.com');
    console.log('   Password: 123456');
    console.log('');
    console.log('👷 TRABAJADORES:');
    console.log('   Email: trabajador1@serviestiba.com');
    console.log('   Email: trabajador2@serviestiba.com');
    console.log('   Email: trabajador3@serviestiba.com');
    console.log('   Password: 123456 (para todos)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
