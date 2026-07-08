import { z } from 'zod';
import { Story, User } from '@prisma/client';
import { createStorySchema, updateStorySchema } from '../schemas/storySchema';

export type CreateStoryDTO = z.infer<typeof createStorySchema>['body'];
export type UpdateStoryDTO = z.infer<typeof updateStorySchema>['body'];

type StoryWithAuthor = Story & {
    user?: { name: string; username: string } | null;
};

export class StoryResponseDTO {
    public readonly id: string;
    public readonly userId: string;
    public readonly title: string;
    public readonly body: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    public readonly author?: { name: string; username: string };

    constructor(story: StoryWithAuthor) {
        this.id = story.storyId;
        this.userId = story.userId;
        this.title = story.title;
        this.body = story.body;
        this.createdAt = story.createdAt;
        this.updatedAt = story.updatedAt;
        if (story.user) {
            this.author = {
                name: story.user.name,
                username: story.user.username,
            };
        }
    }
}
