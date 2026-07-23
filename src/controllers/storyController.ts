import { Response } from 'express';
import { StoryService } from '../services/storyService';
import { asyncHandler } from '../utils/asyncHandler';
import { httpStatusCodes } from '../constants/statusCode';
import { sendResponse } from '../utils/response';
import { Messages } from '../constants/messages';
import { StoryQueryParams } from '../schemas/querySchema';
import { getQuery } from '../utils/request';

const storyService = new StoryService();

export const StoryController = {
    createStory: asyncHandler(async (req, res: Response) => {
        const { body } = req.body;
        const story = await storyService.createStory(body);
        sendResponse(res, httpStatusCodes.CREATED, story);
    }),

    getAllStories: asyncHandler(async (req, res: Response) => {
        const query = getQuery<StoryQueryParams>(req);
        const stories = await storyService.getAllStories(query);
        sendResponse(res, httpStatusCodes.OK, stories);
    }),

    getStoryById: asyncHandler(async (req, res: Response) => {
        const storyId = req.params.storyId as string;
        const story = await storyService.getStoryById(storyId);
        sendResponse(res, httpStatusCodes.OK, story);
    }),

    updateStory: asyncHandler(async (req, res: Response) => {
        const storyId = req.params.storyId as string;
        const story = await storyService.updateStory(storyId, req.body);
        sendResponse(res, httpStatusCodes.OK, story);
    }),

    deleteStory: asyncHandler(async (req, res: Response) => {
        const storyId = req.params.storyId as string;
        await storyService.deleteStory(storyId);
        sendResponse(
            res,
            httpStatusCodes.OK,
            undefined,
            Messages.STORY_DELETED,
        );
    }),
};
