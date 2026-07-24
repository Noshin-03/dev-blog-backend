import { Request } from 'express';
import { StoryService } from '../services/storyService';

export const getStoryOwnerId = async (
    req: Request,
): Promise<string | undefined> => {
    const storyId = req.params.storyId as string;

    if (!storyId) {
        return undefined;
    }

    const storyService = new StoryService();

    const story = await storyService.getStoryById(storyId);

    return story?.userId;
};
