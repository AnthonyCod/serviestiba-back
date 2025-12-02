import prisma from '../../config/prisma.js';
import { Prisma } from '@prisma/client';

interface CrearAsignacionDTO {
  requerimiento_id: number;
  trabajadores_ids: number[];
  extra_info?: string;
}

// 1. Crear Asignación (Con firma del Encargado)
export const createAsignacion = async (data: CrearAsignacionDTO, creadorId: number) => {
  
  // A. Validar Requerimiento
  const req = await prisma.requerimiento.findUnique({
    where: { id: data.requerimiento_id },
    include: { asignaciones: true }
  });

  if (!req) throw new Error("El Requerimiento no existe");
  if (req.asignaciones.length > 0) throw new Error(`El requerimiento #${req.id} YA tiene personal asignado.`);
  
  // Validar Cantidad Exacta
  if (req.cantidad_personal !== data.trabajadores_ids.length) {
    throw new Error(`Error de Cantidad: Se piden ${req.cantidad_personal}, enviaste ${data.trabajadores_ids.length}.`);
  }

  // B. Validar Trabajadores (Roles y Cruces de Horario)
  const trabajadores = await prisma.persona.findMany({
    where: { id: { in: data.trabajadores_ids } },
    include: {
      usuario: true,
      detalles_asignacion: {
        include: { asignacion: { include: { requerimiento: true } } }
      }
    }
  });

  if (trabajadores.length !== data.trabajadores_ids.length) throw new Error("IDs de trabajadores inválidos.");

  const errores: string[] = []; 
  for (const trabajador of trabajadores) {
    // Solo Rol 3 (Trabajador)
    if (trabajador.usuario?.fk_rol !== 3) {
      errores.push(`❌ ${trabajador.nombre}: No es trabajador (Rol incorrecto).`);
      continue; 
    }

    // Cruce de Horarios (Ignorando cancelados)
    const cruce = trabajador.detalles_asignacion.find((detalle) => {
      if (detalle.asignacion.estado_trabajo === 'Cancelado') return false;
      const otroReq = detalle.asignacion.requerimiento;
      
      const fechaNueva = req.fecha_servicio.toISOString().split('T')[0];
      const fechaVieja = otroReq.fecha_servicio.toISOString().split('T')[0];
      if (fechaNueva !== fechaVieja) return false;

      const nIni = new Date(req.hora_inicio).getTime();
      const nFin = new Date(req.hora_fin).getTime();
      const vIni = new Date(otroReq.hora_inicio).getTime();
      const vFin = new Date(otroReq.hora_fin).getTime();

      return (nIni < vFin && nFin > vIni);
    });

    if (cruce) errores.push(`❌ ${trabajador.nombre}: Ocupado en otro servicio.`);
  }

  if (errores.length > 0) throw new Error(`Errores de validación:\n${errores.join('\n')}`);

  // C. Guardar en Base de Datos
  return await prisma.$transaction(async (tx) => {
    const asignacion = await tx.asignacion.create({
      data: {
        requerimiento_id: data.requerimiento_id,
        estado_trabajo: 'Pendiente',
        extra_info: data.extra_info ?? null,
        creado_por_id: creadorId // <--- FIRMA DEL ENCARGADO
      },
      include: {
        creado_por: { select: { email: true, persona: { select: { nombre: true, apellido: true } } } }
      }
    });

    const detallesData = data.trabajadores_ids.map((personaId) => ({
      asignacion_id: asignacion.id,
      persona_id: personaId,
      asistencia: 'Pendiente' as const
    }));

    await tx.detalleAsignacion.createMany({ data: detallesData });

    return asignacion;
  });
};

// 2. Reporte de Auditoría (Para el ADMIN)
export const getReporteAdmin = async (filtros: any) => {
  const { inicio, fin, encargadoId, estado } = filtros;

  // 1. Creamos el objeto de filtro base (Solo con las fechas, que son obligatorias)
  const whereClause: Prisma.AsignacionWhereInput = {
    requerimiento: {
      fecha_servicio: {
        gte: new Date(inicio),
        lte: new Date(fin)
      }
    }
  };

  // 2. Agregamos el filtro de Encargado SOLO si enviaron un ID
  if (encargadoId) {
    whereClause.creado_por_id = Number(encargadoId);
  }

  // 3. Agregamos el filtro de Estado SOLO si enviaron un estado
  if (estado) {
    whereClause.estado_trabajo = estado;
  }

  // 4. Ejecutamos la consulta pasando el objeto limpio
  return await prisma.asignacion.findMany({
    where: whereClause,
    include: {
      creado_por: { 
        select: { 
          email: true, 
          persona: true 
        } 
      },
      requerimiento: { 
        include: { 
          sede: { 
            include: { empresa: true } 
          } 
        } 
      },
      detalles_asignacion: { 
        include: { persona: true } 
      }
    },
    orderBy: { fecha_creacion: 'desc' }
  });
};
// 3. Otros métodos estándar
export const updateAsistencia = async (asignacionId: number, personaId: number, estado: 'Si' | 'No' | 'Tardanza') => {
  return await prisma.detalleAsignacion.update({
    where: { asignacion_id_persona_id: { asignacion_id: asignacionId, persona_id: personaId } },
    data: { asistencia: estado }
  });
};

export const getById = async (id: number) => {
  return await prisma.asignacion.findUnique({
    where: { id },
    include: { requerimiento: { include: { sede: true } }, detalles_asignacion: { include: { persona: true } } }
  });
};

export const getAll = async () => {
  return await prisma.asignacion.findMany({
    include: { creado_por: true, requerimiento: { include: { sede: { include: { empresa: true } } } }, detalles_asignacion: { include: { persona: true } } },
    orderBy: { id: 'desc' }
  });
};

export const updateEstado = async (id: number, nuevoEstado: string) => {
  return await prisma.asignacion.update({ where: { id }, data: { estado_trabajo: nuevoEstado } });
};