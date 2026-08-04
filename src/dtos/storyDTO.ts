import { z } from 'zod';
import { Story, StoryCategory, Category } from '@prisma/client';
import { createStorySchema, updateStorySchema } from '../schemas/storySchema';

export type CreateStoryDTO = z.infer<typeof createStorySchema>['body'];
export type UpdateStoryDTO = z.infer<typeof updateStorySchema>['body'];

type StoryWithRelations = Story & {
    user?: { name: string; username: string } | null;
    categories?: (StoryCategory & { category: Category })[];
};

export class ListStoryDTO {
    public readonly id: string;
    public readonly title: string;
    public readonly createdAt: Date;
    public readonly author?: { name: string; username: string };
    public readonly categories?: { id: string; name: string }[];

    constructor(story: StoryWithRelations) {
        this.id = story.storyId;
        this.title = story.title;
        this.createdAt = story.createdAt;
        if (story.user) {
            this.author = {
                name: story.user.name,
                username: story.user.username,
            };
        }
        if (story.categories) {
            this.categories = story.categories.map((sc) => ({
                id: sc.category.id,
                name: sc.category.name,
            }));
        }
    }
}

export class StoryResponseDTO {
    public readonly id: string;
    public readonly userId: string;
    public readonly title: string;
    public readonly body: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    public readonly summary: string | null;
    public readonly author?: { name: string; username: string };
    public readonly categories?: { id: string; name: string }[];

    constructor(story: StoryWithRelations) {
        this.id = story.storyId;
        this.userId = story.userId;
        this.title = story.title;
        this.body = story.body;
        this.createdAt = story.createdAt;
        this.updatedAt = story.updatedAt;
        this.summary = story.summary;
        if (story.user) {
            this.author = {
                name: story.user.name,
                username: story.user.username,
            };
        }
        if (story.categories) {
            this.categories = story.categories.map((sc) => ({
                id: sc.category.id,
                name: sc.category.name,
            }));
        }
    }
}
