import { Prisma, PrismaClient, Story } from '@prisma/client';
import {
    CreateStoryDTO,
    StoryResponseDTO,
    UpdateStoryDTO,
} from '../dtos/storyDTO';
import { StoryQueryParams } from '../schemas/querySchema';

const getStoryWhere = (params: StoryQueryParams): Prisma.StoryWhereInput => {
    const { title, author, createdAt, category } = params;
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
        ...(category && {
            categories: {
                some: {
                    category: {
                        name: { equals: category, mode: 'insensitive' },
                    },
                },
            },
        }),
    };
};

export class StoryRepository {
    constructor(private prisma: PrismaClient) {}

    async create(data: CreateStoryDTO): Promise<Story> {
        const { categoryIds, ...storyData } = data;
        return this.prisma.story.create({
            data: {
                ...storyData,
                ...(categoryIds && {
                    categories: {
                        create: categoryIds.map((categoryId) => ({
                            categoryId,
                        })),
                    },
                }),
            },
            include: {
                user: { select: { name: true, username: true } },
                categories: { include: { category: true } },
            },
        });
    }

    async findAll(params: StoryQueryParams): Promise<Story[]> {
        const { page, itemsPerPage, orderBy } = params;
        const where = getStoryWhere(params);

        return this.prisma.story.findMany({
            where,
            include: {
                user: { select: { name: true, username: true } },
                categories: { include: { category: true } },
            },
            orderBy: { [orderBy ?? 'createdAt']: 'desc' },
            take: itemsPerPage,
            skip: (page - 1) * itemsPerPage,
        });
    }

    async getById(id: string): Promise<Story | null> {
        return this.prisma.story.findUnique({
            where: { storyId: id },
            include: {
                user: { select: { name: true, username: true } },
                categories: { include: { category: true } },
            },
        });
    }

    async checkById(id: string): Promise<boolean> {
        const story = await this.prisma.story.findUnique({
            where: { storyId: id },
            select: { storyId: true },
        });
        return story !== null;
    }

    async updateSummary(id: string, summary: string): Promise<Story> {
        return this.prisma.story.update({
            where: { storyId: id },
            data: {
                summary,
            },
        });
    }

    async update(id: string, data: UpdateStoryDTO): Promise<Story> {
        const { categoryIds, ...storyData } = data;

        return this.prisma.story.update({
            where: { storyId: id },
            data: {
                ...storyData,
                ...(categoryIds && {
                    categories: {
                        deleteMany: {},
                        create: categoryIds.map((categoryId) => ({
                            categoryId,
                        })),
                    },
                }),
            },
            include: {
                user: { select: { name: true, username: true } },
                categories: { include: { category: true } },
            },
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.story.delete({
            where: { storyId: id },
        });
    }
}
