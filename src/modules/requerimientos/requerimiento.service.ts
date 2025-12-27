import prisma from '../../config/prisma.js';
import { CreateRequerimientoDto } from './dtos/requerimiento.dto.js';

export class RequerimientoService {
  

  private parseTime(timeStr: string): Date {
    return new Date(`1970-01-01T${timeStr}:00Z`);
  }

  async findAll() {
    return await prisma.requerimiento.findMany({
      include: { 
        sede: { 
          include: { empresa: true } 
        } 
      },
      orderBy: { id: 'desc' }
    });
  }

  async findOne(id: number) {
    const requerimiento = await prisma.requerimiento.findUnique({
      where: { id },
      include: { 
        sede: { include: { empresa: true } },
        asignaciones: true 
      } 
    });
    return requerimiento;
  }

  async create(data: CreateRequerimientoDto) {
    // Transformación de datos antes de guardar
    const fecha = new Date(data.fecha_servicio);
    const inicio = this.parseTime(data.hora_inicio);
    const fin = this.parseTime(data.hora_fin);

    return await prisma.requerimiento.create({
      data: {
        sede_id: data.sede_id,
        fecha_servicio: fecha,
        hora_inicio: inicio,
        hora_fin: fin,
        cantidad_personal: data.cantidad_personal,
        // Manejo de nulos/opcionales
        extra_info: data.extra_info ?? null,
        herramienta: data.herramienta ?? null,
        viatico: data.viatico ?? null,
        adicional: data.adicional ?? null 
      },
      include: { sede: true } // Retornamos la sede para confirmación visual inmediata
    });
  }
}