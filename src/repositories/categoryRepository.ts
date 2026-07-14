import { Category, PrismaClient } from '@prisma/client';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../dtos/categoryDTO';

export class CategoryRepository {
    constructor(private prisma: PrismaClient) {}

    async create(data: CreateCategoryDTO) {
        return this.prisma.category.create({ data });
    }

    async findAll(): Promise<Category[]> {
        return this.prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async findById(id: string): Promise<Category | null> {
        return this.prisma.category.findUnique({ where: { id } });
    }

    async findByName(name: string): Promise<Category | null> {
        return this.prisma.category.findUnique({
            where: { name },
        });
    }

    async checkById(id: string): Promise<boolean> {
        const category = await this.prisma.category.findUnique({
            where: { id },
            select: { id: true },
        });
        return category !== null;
    }

    async update(id: string, data: UpdateCategoryDTO): Promise<Category> {
        return this.prisma.category.update({ where: { id }, data });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.category.delete({ where: { id } });
    }
}
