import type { Response } from 'express';
import type { RequestExt } from '../../common/middlewares/auth.middleware.js';
import * as service from './requerimiento.service.js';

export const getRequerimientos = async (req: RequestExt, res: Response) => {
  try {
    const data = await service.getAll();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const getReqById = async (req: RequestExt, res: Response) => {
  try {
    const { id } = req.params;
    const data = await service.getById(Number(id));
    if (!data) {
      res.status(404).json({ error: 'Requerimiento no encontrado' });
      return;
    }
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const createRequerimiento = async (req: RequestExt, res: Response) => {
  try {
    const nuevo = await service.create(req.body);
    res.status(201).json(nuevo);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};