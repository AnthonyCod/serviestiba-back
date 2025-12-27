import type { Request, Response } from 'express';
import { RequerimientoService } from './requerimiento.service.js';
import { CreateRequerimientoDto } from './dtos/requerimiento.dto.js';

export class RequerimientoController {
  private service: RequerimientoService;

  constructor() {
    this.service = new RequerimientoService();
  }

  // GET /
  getRequerimientos = async (_req: Request, res: Response) => {
    try {
      const data = await this.service.findAll();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // GET /:id
  getReqById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.service.findOne(Number(id));
      
      if (!data) {
        res.status(404).json({ error: 'Requerimiento no encontrado' });
        return;
      }
      
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // POST /
  // Tipamos explícitamente el Body con el DTO
  createRequerimiento = async (req: Request<unknown, unknown, CreateRequerimientoDto>, res: Response) => {
    try {
      // Ya no necesitamos validar manual, el middleware validateSchema lo hizo
      const nuevo = await this.service.create(req.body);
      res.status(201).json(nuevo);
    } catch (error: any) {
      // Prisma errors o lógica de negocio
      res.status(400).json({ error: error.message });
    }
  };
}