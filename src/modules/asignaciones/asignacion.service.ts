import prisma from '../../config/prisma.js';
import { Prisma } from '@prisma/client';
import { CreateAsignacionDto, ReporteFilterDto, UpdateAsistenciaDto } from './dtos/asignacion.dto.js';

export class AsignacionService {

  // 1. Crear Asignación (Compleja)
  async create(data: CreateAsignacionDto, creadorId: number) {
    
    // A. Validar Requerimiento
    const req = await prisma.requerimiento.findUnique({
      where: { id: data.requerimiento_id },
      include: { asignaciones: true }
    });

    if (!req) throw new Error("REQ_NOT_FOUND"); // Controlado en Controller
    if (req.asignaciones.length > 0) throw new Error("REQ_ALREADY_ASSIGNED");
    
    // Validar Cantidad Exacta
    if (req.cantidad_personal !== data.trabajadores_ids.length) {
      throw new Error(`QUANTITY_MISMATCH: Esperado ${req.cantidad_personal}, Recibido ${data.trabajadores_ids.length}`);
    }

    // B. Validar Trabajadores y Cruces
    const trabajadores = await prisma.persona.findMany({
      where: { id: { in: data.trabajadores_ids } },
      include: {
        usuario: true,
        detalles_asignacion: {
          include: { asignacion: { include: { requerimiento: true } } }
        }
      }
    });

    if (trabajadores.length !== data.trabajadores_ids.length) {
      throw new Error("INVALID_WORKER_IDS");
    }

    const errores: string[] = []; 
    
    for (const trabajador of trabajadores) {
      // 1. Validar Rol (3 = Trabajador)
      if (trabajador.usuario?.fk_rol !== 3) {
        errores.push(`❌ ${trabajador.nombre}: No tiene rol de Trabajador.`);
        continue;
      }

      // 2. Validar Cruce de Horarios (Tu lógica original preservada)
      const cruce = trabajador.detalles_asignacion.find((detalle) => {
        if (detalle.asignacion.estado_trabajo === 'Cancelado') return false;
        
        const otroReq = detalle.asignacion.requerimiento;
        
        // Comparar Fechas (String YYYY-MM-DD)
        const fechaNueva = req.fecha_servicio.toISOString().split('T')[0];
        const fechaVieja = otroReq.fecha_servicio.toISOString().split('T')[0];
        if (fechaNueva !== fechaVieja) return false;

        // Comparar Horas (Milisegundos)
        const nIni = new Date(req.hora_inicio).getTime();
        const nFin = new Date(req.hora_fin).getTime();
        const vIni = new Date(otroReq.hora_inicio).getTime();
        const vFin = new Date(otroReq.hora_fin).getTime();

        // Lógica de intersección de rangos
        return (nIni < vFin && nFin > vIni);
      });

      if (cruce) {
        errores.push(`❌ ${trabajador.nombre}: Ocupado en otro servicio ese día.`);
      }
    }

    if (errores.length > 0) {
      // Lanzamos un error especial que contiene la lista
      throw new Error(JSON.stringify({ type: 'VALIDATION_ERROR', details: errores }));
    }

    // C. Transacción de Guardado
    return await prisma.$transaction(async (tx) => {
      const asignacion = await tx.asignacion.create({
        data: {
          requerimiento_id: data.requerimiento_id,
          estado_trabajo: 'Pendiente',
          extra_info: data.extra_info ?? null,
          creado_por_id: creadorId,
        },
        include: {
          creado_por: { 
            select: { email: true, persona: { select: { nombre: true, apellido: true } } } 
          }
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
  }

  // 2. Reporte con Filtros Dinámicos
  async getReporteAdmin(filtros: ReporteFilterDto) {
    const { inicio, fin, encargado, estado } = filtros;

    const whereClause: Prisma.AsignacionWhereInput = {
      requerimiento: {
        fecha_servicio: {
          gte: new Date(inicio),
          lte: new Date(fin)
        }
      }
    };

    if (encargado) whereClause.creado_por_id = Number(encargado);
    if (estado) whereClause.estado_trabajo = estado;

    return await prisma.asignacion.findMany({
      where: whereClause,
      include: {
        creado_por: { select: { email: true, persona: true } },
        requerimiento: { include: { sede: { include: { empresa: true } } } },
        detalles_asignacion: { include: { persona: true } }
      },
      orderBy: { fecha_creacion: 'desc' }
    });
  }

  // 3. Métodos estándar
  async updateAsistencia(data: UpdateAsistenciaDto) {
    return await prisma.detalleAsignacion.update({
      where: { 
        asignacion_id_persona_id: { 
          asignacion_id: data.asignacionId, 
          persona_id: data.personaId 
        } 
      },
      data: { asistencia: data.estado }
    });
  }

  async getAll() {
    return await prisma.asignacion.findMany({
      include: { 
        creado_por: true, 
        requerimiento: { include: { sede: { include: { empresa: true } } } }, 
        detalles_asignacion: { include: { persona: true } } 
      },
      orderBy: { id: 'desc' }
    });
  }

  async getById(id: number) {
    return await prisma.asignacion.findUnique({
      where: { id },
      include: { 
        requerimiento: { include: { sede: true } }, 
        detalles_asignacion: { include: { persona: true } } 
      }
    });
  }

  // Se infiere el tipo de EstadoTrabajo desde prisma o string validado
  async updateEstado(id: number, nuevoEstado: any) {
    return await prisma.asignacion.update({ 
      where: { id }, 
      data: { estado_trabajo: nuevoEstado } 
    });
  }
}