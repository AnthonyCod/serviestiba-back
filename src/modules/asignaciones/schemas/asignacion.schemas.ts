import { z } from 'zod';
import { EstadoTrabajo, Asistencia } from '@prisma/client';

// Helper para validar IDs numéricos en URL (params)
const idSchema = z.string().regex(/^\d+$/, "ID debe ser número").transform(Number);

export const createAsignacionSchema = z.object({
  body: z.object({
    requerimiento_id: z.number().int().positive(),
    trabajadores_ids: z.array(z.number().int().positive())
      .min(1, "Debes asignar al menos un trabajador"),
    extra_info: z.string().optional(),
  }),
});

export const updateAsistenciaSchema = z.object({
  body: z.object({
    asignacionId: z.number().int().positive(),
    personaId: z.number().int().positive(),
    // SOLUCIÓN: Usamos 'message' directamente en lugar de 'errorMap'
    estado: z.nativeEnum(Asistencia, { 
      message: "Estado de asistencia inválido (Si, No, Tardanza, Pendiente)" 
    }),
  }),
});

export const changeEstadoSchema = z.object({
  params: z.object({ id: idSchema }), 
  body: z.object({
    // SOLUCIÓN: Igual aquí, simplificamos el mensaje de error
    estado: z.nativeEnum(EstadoTrabajo, {
      message: "Estado de trabajo inválido (Pendiente, Terminado, Cancelado)"
    }),
  }),
});

export const reporteSchema = z.object({
  query: z.object({
    inicio: z.string().refine((d) => !isNaN(Date.parse(d)), "Fecha inicio inválida (YYYY-MM-DD)"),
    fin: z.string().refine((d) => !isNaN(Date.parse(d)), "Fecha fin inválida (YYYY-MM-DD)"),
    encargado: z.string().regex(/^\d+$/, "ID encargado inválido").optional(),
    estado: z.nativeEnum(EstadoTrabajo).optional(),
  }),
});