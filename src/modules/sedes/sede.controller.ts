import type { Request, Response } from 'express';
import { SedeService } from './sede.service.js';

export class SedeController {
    private service: SedeService;

    constructor() {
        this.service = new SedeService();
    }

    getSedes = async (req: Request, res: Response) => {
        try {
            const sedes = await this.service.getAll();
            res.json(sedes);
        } catch (error: any) {
            console.error('Error al obtener sedes:', error);
            res.status(500).json({ error: 'Error al obtener sedes' });
        }
    };

    getSedeById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const sede = await this.service.getById(id);

            if (!sede) {
                return res.status(404).json({ error: 'Sede no encontrada' });
            }

            res.json(sede);
        } catch (error: any) {
            console.error('Error al obtener sede:', error);
            res.status(500).json({ error: 'Error al obtener sede' });
        }
    };
}
