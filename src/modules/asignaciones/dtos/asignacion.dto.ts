import { EstadoTrabajo, Asistencia } from '@prisma/client'; 
// Asegúrate de que Prisma genere los tipos (npx prisma generate)

export class CreateAsignacionDto {
  requerimiento_id!: number;
  trabajadores_ids!: number[];
  extra_info?: string;
}

export class UpdateAsistenciaDto {
  asignacionId!: number;
  personaId!: number;
  estado!: Asistencia; // 'Si' | 'No' | 'Tardanza' | 'Pendiente'
}

export class ChangeEstadoDto {
  estado!: string; // Se validará contra el Enum en el Schema
}

export class ReporteFilterDto {
  inicio!: string;     // YYYY-MM-DD
  fin!: string;        // YYYY-MM-DD
  encargado?: string;  // ID en string (query param)
  estado?: EstadoTrabajo;
}