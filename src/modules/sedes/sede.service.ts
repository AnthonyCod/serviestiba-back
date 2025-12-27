import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SedeService {
    async getAll() {
        return await prisma.sede.findMany({
            include: {
                empresa: true,
            },
            orderBy: {
                nombre_sede: 'asc',
            },
        });
    }

    async getById(id: number) {
        return await prisma.sede.findUnique({
            where: { id },
            include: {
                empresa: true,
            },
        });
    }
}
