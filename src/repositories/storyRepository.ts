import { PrismaClient, Story } from '@prisma/client';
import { CreateStoryDTO, UpdateStoryDTO } from '../dtos/storyDTO';
import { StoryQueryParams } from '../schemas/querySchema';

export class StoryRepository {
    constructor(private prisma: PrismaClient) {}

    async create(data: CreateStoryDTO): Promise<Story> {
        return this.prisma.story.create({ data });
    }

    async findAll(params: StoryQueryParams): Promise<Story[]> {
        const { page, itemsPerPage, title, author, createdAt, orderBy } =
            params;

        return this.prisma.story.findMany({
            where: {
                ...(title && {
                    title: { contains: title, mode: 'insensitive' },
                }),
                ...(author && {
                    user: { name: { contains: author, mode: 'insensitive' } },
                }),
                ...(createdAt && {
                    createdAt: { gte: new Date(createdAt) },
                }),
            },
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
