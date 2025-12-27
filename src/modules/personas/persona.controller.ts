import type { Request, Response } from 'express';
import { PersonaService } from './persona.service.js';

export class PersonaController {
    private service: PersonaService;

    constructor() {
        this.service = new PersonaService();
    }

    getTrabajadores = async (req: Request, res: Response) => {
        try {
            // Obtener query parameter capacidad (opcional)
            const capacidad = req.query.capacidad as string | undefined;

            // Obtener trabajadores filtrados por capacidad
            const trabajadores = await this.service.getTrabajadores(capacidad);
            res.json(trabajadores);
        } catch (error: any) {
            console.error('Error al obtener trabajadores:', error);
            res.status(500).json({ error: 'Error al obtener trabajadores' });
        }
    };

    getPersonaById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }

            const persona = await this.service.getById(id);

            if (!persona) {
                return res.status(404).json({ error: 'Persona no encontrada' });
            }

            res.json(persona);
        } catch (error: any) {
            console.error('Error al obtener persona:', error);
            res.status(500).json({ error: 'Error al obtener persona' });
        }
    };
}
