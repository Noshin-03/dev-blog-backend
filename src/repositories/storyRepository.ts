import { PrismaClient, Story } from '@prisma/client';
import { CreateStoryDTO, UpdateStoryDTO } from '../dtos/storyDTO';

export class StoryRepository {
    constructor(private prisma: PrismaClient) {}

    async create(data: CreateStoryDTO): Promise<Story> {
        return this.prisma.story.create({ data });
    }

    async findAll(): Promise<Story[]> {
        return this.prisma.story.findMany({
            orderBy: { createdAt: 'desc' },
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
