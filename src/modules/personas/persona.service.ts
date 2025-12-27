import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PersonaService {
    /**
     * Obtener solo trabajadores (personas con rol 3)
     * @param capacidad - Opcional: filtrar por capacidad (Nestle, Molitalia, Ambos)
     */
    async getTrabajadores(capacidad?: string) {
        const whereClause: any = {
            usuario: {
                fk_rol: 3, // Solo trabajadores
            },
        };

        // Si se especifica capacidad, agregar filtro
        if (capacidad && capacidad !== 'Todos') {
            whereClause.capacidad = capacidad;
        }

        return await prisma.persona.findMany({
            where: whereClause,
            select: {
                id: true,
                nombre: true,
                apellido: true,
                telefono: true,
                distrito: true,
                capacidad: true, // ← Agregado
            },
            orderBy: {
                nombre: 'asc',
            },
        });
    }

    /**
     * Obtener una persona por ID
     */
    async getById(id: number) {
        return await prisma.persona.findUnique({
            where: { id },
            select: {
                id: true,
                nombre: true,
                apellido: true,
                telefono: true,
                distrito: true,
            },
        });
    }
}
