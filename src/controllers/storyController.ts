import { Request, Response } from 'express';
import { StoryService } from '../services/storyService';
import { asyncHandler } from '../utils/asyncHandler';
import { httpStatusCodes } from '../constants/statusCode';
import { sendResponse } from '../utils/response';
import { CreateStoryDTO, UpdateStoryDTO } from '../dtos/storyDTO';
import { Messages } from '../constants/messages';
import { StoryQueryParams } from '../schemas/querySchema';

type StoryParams = { id: string };

const getValidatedBody = <T>(req: Request): T => req.body as T;
const getValidatedParams = <T extends Record<string, string>>(
    req: Request,
): T => req.params as T;

const storyService = new StoryService();

export const StoryController = {
    createStory: asyncHandler(async (req: Request, res: Response) => {
        const body = getValidatedBody<CreateStoryDTO>(req);
        const story = await storyService.createStory(body);
        sendResponse(res, httpStatusCodes.CREATED, story);
    }),

    getAllStories: asyncHandler(async (req: Request, res: Response) => {
        const query = req.query as unknown as StoryQueryParams;
        const stories = await storyService.getAllStories(query);
        sendResponse(res, httpStatusCodes.OK, stories);
    }),

    getStoryById: asyncHandler(async (req: Request, res: Response) => {
        const { id } = getValidatedParams<StoryParams>(req);
        const story = await storyService.getStoryById(id);
        sendResponse(res, httpStatusCodes.OK, story);
    }),

    updateStory: asyncHandler(async (req: Request, res: Response) => {
        const { id } = getValidatedParams<StoryParams>(req);
        const body = getValidatedBody<UpdateStoryDTO>(req);
        const story = await storyService.updateStory(id, body);
        sendResponse(res, httpStatusCodes.OK, story);
    }),

    deleteStory: asyncHandler(async (req: Request, res: Response) => {
        const { id } = getValidatedParams<StoryParams>(req);
        await storyService.deleteStory(id);
        sendResponse(
            res,
            httpStatusCodes.OK,
            undefined,
            Messages.STORY_DELETED,
        );
    }),
};
