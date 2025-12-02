import type { Response } from 'express';
import type { RequestExt } from '../../common/middlewares/auth.middleware.js';
import * as service from './asignacion.service.js';

// Crear Asignación (Solo Encargados)
export const crearAsignacion = async (req: RequestExt, res: Response) => {
  try {
    const usuarioId = req.user.id; // ID del Encargado (token)
    const nueva = await service.createAsignacion(req.body, usuarioId);
    res.status(201).json({ message: 'Asignación creada y firmada', data: nueva });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

// Ver Reporte (Solo Admin)
export const verReporteAdmin = async (req: RequestExt, res: Response) => {
  try {
    const { inicio, fin, encargado, estado } = req.query;
    if (!inicio || !fin) { res.status(400).json({ error: 'Faltan fechas (?inicio=...&fin=...)' }); return; }

    const reporte = await service.getReporteAdmin({ inicio, fin, encargadoId: encargado, estado });
    res.json(reporte);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

// Marcar Asistencia
export const marcarAsistencia = async (req: RequestExt, res: Response) => {
  try {
    const { asignacionId, personaId, estado } = req.body;
    const result = await service.updateAsistencia(asignacionId, personaId, estado);
    res.json(result);
  } catch (e: any) { res.status(400).json({ error: 'Error al marcar asistencia' }); }
};

// Ver Detalle
export const getAsignacion = async (req: RequestExt, res: Response) => {
  try {
    const { id } = req.params;
    const data = await service.getById(Number(id));
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// Listar Todo
export const getTodasLasAsignaciones = async (req: RequestExt, res: Response) => {
  try { const lista = await service.getAll(); res.json(lista); } 
  catch (e: any) { res.status(500).json({ error: e.message }); }
};

// Cambiar Estado (Cancelar/Finalizar)
export const cambiarEstado = async (req: RequestExt, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const result = await service.updateEstado(Number(id), estado);
    res.json(result);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};