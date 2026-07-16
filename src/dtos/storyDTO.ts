import { z } from 'zod';
import { Story } from '@prisma/client';
import {
    createStorySchema,
    storyIdParamSchema,
    updateStorySchema,
} from '../schemas/storySchema';

export type CreateStoryDTO = z.infer<typeof createStorySchema>['body'];
export type UpdateStoryDTO = z.infer<typeof updateStorySchema>['body'];

export class StoryResponseDTO {
    public readonly id: string;
    public readonly userId: string;
    public readonly title: string;
    public readonly body: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(story: Story) {
        this.id = story.storyId;
        this.userId = story.userId;
        this.title = story.title;
        this.body = story.body;
        this.createdAt = story.createdAt;
        this.updatedAt = story.updatedAt;
    }
}
