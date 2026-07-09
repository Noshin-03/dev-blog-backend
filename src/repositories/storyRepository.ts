import { Prisma, PrismaClient, Story } from '@prisma/client';
import { CreateStoryDTO, UpdateStoryDTO } from '../dtos/storyDTO';
import { StoryQueryParams } from '../schemas/querySchema';

const getStoryWhere = (params: StoryQueryParams): Prisma.StoryWhereInput => {
    const { title, author, createdAt } = params;
    return {
        ...(title && {
            title: { contains: title, mode: 'insensitive' },
        }),
        ...(author && {
            user: { username: { contains: author, mode: 'insensitive' } },
        }),
        ...(createdAt && {
            createdAt: { gte: new Date(createdAt) },
        }),
    };
};

export class StoryRepository {
    constructor(private prisma: PrismaClient) {}

    async create(data: CreateStoryDTO): Promise<Story> {
        return this.prisma.story.create({ data });
    }

    async findAll(params: StoryQueryParams): Promise<Story[]> {
        const { page, itemsPerPage, orderBy } = params;
        const where = getStoryWhere(params);

        return this.prisma.story.findMany({
            where,
            include: { user: { select: { name: true, username: true } } },
            orderBy: { [orderBy ?? 'createdAt']: 'desc' },
            take: itemsPerPage,
            skip: (page - 1) * itemsPerPage,
        });
    }

    async getById(id: string): Promise<Story | null> {
        return this.prisma.story.findUnique({
            where: { storyId: id },
        });
    }

    async checkById(id: string): Promise<boolean> {
        const story = await this.prisma.story.findUnique({
            where: { storyId: id },
            select: { storyId: true },
        });
        return story !== null;
    }

    async update(id: string, data: UpdateStoryDTO): Promise<Story> {
        return this.prisma.story.update({
            where: { storyId: id },
            data,
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.story.delete({
            where: { storyId: id },
        });
    }
}
