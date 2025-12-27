import type { Response, Request } from 'express';
import { AsignacionService } from './asignacion.service.js';
import type { RequestExt } from '../../common/middlewares/auth.middleware.js';
import { CreateAsignacionDto,ReporteFilterDto,UpdateAsistenciaDto } from './dtos/asignacion.dto.js';

export class AsignacionController {
  private service: AsignacionService;

  constructor() {
    this.service = new AsignacionService();
  }

  // Operativa: Crear
  crearAsignacion = async (req: RequestExt, res: Response) => {
    try {
      const usuarioId = req.user!.id; // ! porque checkAuth garantiza que existe
      const body = req.body as CreateAsignacionDto;
      
      const nueva = await this.service.create(body, usuarioId);
      res.status(201).json({ message: 'Asignación creada exitosamente', data: nueva });
      
    } catch (error: any) {
      // Manejo de errores complejos (Array de strings de validación)
      if (error.message.includes('VALIDATION_ERROR')) {
        const parsed = JSON.parse(error.message);
        res.status(400).json({ error: 'Errores de validación', details: parsed.details });
        return; 
      }
      
      // Errores conocidos simples
      const errorMap: Record<string, string> = {
        'REQ_NOT_FOUND': 'El requerimiento no existe',
        'REQ_ALREADY_ASSIGNED': 'El requerimiento ya tiene personal asignado',
        'INVALID_WORKER_IDS': 'Algunos IDs de trabajadores no existen'
      };

      if (errorMap[error.message]) {
        res.status(400).json({ error: errorMap[error.message] });
        return;
      }

      if (error.message.startsWith('QUANTITY_MISMATCH')) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: error.message });
    }
  };

  // Reporte Admin
  verReporteAdmin = async (req: Request, res: Response) => {
    try {
      // Convertimos req.query al DTO (Zod ya validó formato, solo hacemos casting seguro)
      const filtros = req.query as unknown as ReporteFilterDto;
      const reporte = await this.service.getReporteAdmin(filtros);
      res.json(reporte);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  marcarAsistencia = async (req: Request, res: Response) => {
    try {
      const result = await this.service.updateAsistencia(req.body as UpdateAsistenciaDto);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: 'Error al actualizar asistencia' });
    }
  };

  cambiarEstado = async (req: Request, res: Response) => {
    try {
      // SOLUCIÓN: Agregamos || '' para evitar error de undefined
      const id = parseInt(req.params.id || '');
      const { estado } = req.body;
      const result = await this.service.updateEstado(id, estado);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getAsignacion = async (req: Request, res: Response) => {
    try {
      // SOLUCIÓN: Agregamos || '' aquí también
      const id = parseInt(req.params.id || '');
      const data = await this.service.getById(id);
      if(!data) { 
        res.status(404).json({error: 'No encontrada'}); 
        return; 
      }
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getTodasLasAsignaciones = async (_req: Request, res: Response) => {
    try {
      const lista = await this.service.getAll();
      res.json(lista);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}