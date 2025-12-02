import prisma from '../../config/prisma.js';

interface CreateReqInput {
  sede_id: number;
  hora_inicio: string;
  hora_fin: string;
  fecha_servicio: string;
  cantidad_personal: number;
  extra_info?: string;
  herramienta?: string;
  viatico?: number;
  adicional?: number; // Agrego este por si acaso lo usas
}

export const getAll = async () => {
  return await prisma.requerimiento.findMany({
    include: { sede: { include: { empresa: true } } },
    orderBy: { id: 'desc' }
  });
};

export const getById = async (id: number) => {
  return await prisma.requerimiento.findUnique({
    where: { id },
    include: { 
      sede: { include: { empresa: true } },
      asignaciones: true 
    } 
  });
};

export const create = async (data: CreateReqInput) => {
  const fecha = new Date(data.fecha_servicio);
  const inicio = new Date(`1970-01-01T${data.hora_inicio}:00Z`);
  const fin = new Date(`1970-01-01T${data.hora_fin}:00Z`);

  return await prisma.requerimiento.create({
    data: {
      sede_id: data.sede_id,
      fecha_servicio: fecha,
      hora_inicio: inicio,
      hora_fin: fin,
      cantidad_personal: data.cantidad_personal,
      extra_info: data.extra_info ?? null,
      herramienta: data.herramienta ?? null,
      viatico: data.viatico ?? null,
      adicional: data.adicional ?? null 
    }
  });
};