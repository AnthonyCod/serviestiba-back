import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando llenado de datos (Seeding)...');

  // 1. Limpiar la base de datos (Orden inverso para respetar llaves foráneas)
  // Ojo: deleteMany borra los datos pero mantiene las tablas
  await prisma.detalleAsignacion.deleteMany();
  await prisma.asignacion.deleteMany();
  await prisma.requerimiento.deleteMany();
  await prisma.persona.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.sede.deleteMany();
  await prisma.empresa.deleteMany();
  await prisma.rol.deleteMany();

  console.log('🧹 Base de datos limpia.');

  // 2. Crear Roles
  await prisma.rol.createMany({
    data: [
      { id: 1, nombre: 'Admin' },
      { id: 2, nombre: 'Encargado' },
      { id: 3, nombre: 'Trabajador' },
    ],
  });

  // 3. Crear Empresas y Sedes
  await prisma.empresa.create({
    data: {
      razon_social: 'Nestlé Perú S.A.',
      ruc: '20100055231',
      sedes: {
        create: [
          { nombre_sede: 'Fábrica Lima', direccion: 'Av. Venezuela 2580' },
          { nombre_sede: 'Centro Distribución', direccion: 'Av. Materiales 3020' },
        ],
      },
    },
  });

  await prisma.empresa.create({
    data: {
      razon_social: 'Alicorp S.A.A.',
      ruc: '20100055237',
      sedes: {
        create: [
          { nombre_sede: 'Molino Callao', direccion: 'Jr. Chucuito 240' },
        ],
      },
    },
  });

  // 4. Generar la contraseña encriptada REAL
  // Aquí ocurre la magia: '123456' se convierte en '$2b$10$...'
  const passwordHash = await bcrypt.hash('123456', 10);

  // 5. Crear Usuario JEFE DE OPERACIONES (Admin)
  await prisma.usuario.create({
    data: {
      email: 'jefe.operaciones@serviestiba.com', // <--- ESTE ES TU LOGIN
      contrasena: passwordHash,                   // <--- ESTA ES LA CLAVE ENCRIPTADA
      fk_rol: 1,
      persona: {
        create: {
          nombre: 'Carlos',
          apellido: 'Vargas',
          dni: '10203040',
          telefono: '999111222',
          activo_empresa: true,
        },
      },
    },
  });

  // 6. Crear un Trabajador de prueba
  await prisma.usuario.create({
    data: {
      email: 'trabajador1@serviestiba.com',
      contrasena: passwordHash, // También usa 123456
      fk_rol: 3,
      persona: {
        create: {
          nombre: 'Luis',
          apellido: 'Quispe',
          dni: '40506070',
          telefono: '988777666',
          capacidad: 'Nestle',
          imo: true,
          activo_empresa: true,
        },
      },
    },
  });

  console.log('✅ Datos insertados correctamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });