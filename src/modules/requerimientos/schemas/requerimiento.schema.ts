import { z } from 'zod';

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/; // Valida HH:mm

export const createRequerimientoSchema = z.object({
  body: z.object({
    // SOLUCIÓN FINAL: Dejar los paréntesis vacíos (). 
    // Zod hace los campos requeridos por defecto.
    sede_id: z.number()
      .int()
      .positive(),

    fecha_servicio: z.string()
      .min(1, "La fecha es obligatoria")
      .refine((date) => !isNaN(Date.parse(date)), { message: "Formato de fecha inválido (YYYY-MM-DD)" }),

    hora_inicio: z.string()
      .min(1, "La hora de inicio es obligatoria")
      .regex(timeRegex, "Formato hora inicio inválido (HH:mm)"),

    hora_fin: z.string()
      .min(1, "La hora fin es obligatoria")
      .regex(timeRegex, "Formato hora fin inválido (HH:mm)"),

    cantidad_personal: z.number()
      .int()
      .positive()
      // Usamos .min() para simular un mensaje personalizado si envían 0
      .min(1, "Debe haber al menos 1 persona"),

    // Campos opcionales
    herramienta: z.string().nullable().optional(),
    viatico: z.number().nonnegative().nullable().optional(),
    adicional: z.number().nonnegative().nullable().optional(),
    extra_info: z.string().nullable().optional(),
  }),
});

export const getByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser un número válido"),
  }),
});