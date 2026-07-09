import { StoryService } from '../services/storyService';
import { asyncHandler } from '../utils/asyncHandler';
import { httpStatusCodes } from '../constants/statusCode';
import { sendResponse } from '../utils/response';
import { CreateStoryDTO, UpdateStoryDTO } from '../dtos/storyDTO';
import { StoryQueryParams } from '../schemas/querySchema';
import { getBody, getParams, getQuery } from '../utils/request';

const storyService = new StoryService();

export const StoryController = {
    createStory: asyncHandler(async (req, res) => {
        const body = getBody<CreateStoryDTO>(req);
        const story = await storyService.createStory(body);
        sendResponse(res, httpStatusCodes.CREATED, story);
    }),

    getAllStories: asyncHandler(async (req, res) => {
        const query = getQuery<StoryQueryParams>(req);
        const stories = await storyService.getAllStories(query);
        sendResponse(res, httpStatusCodes.OK, stories);
    }),

    getStoryById: asyncHandler(async (req, res) => {
        const { storyId } = getParams<{ storyId: string }>(req);
        const story = await storyService.getStoryById(storyId);
        sendResponse(res, httpStatusCodes.OK, story);
    }),

    updateStory: asyncHandler(async (req, res) => {
        const { storyId } = getParams<{ storyId: string }>(req);
        const body = getBody<UpdateStoryDTO>(req);
        const story = await storyService.updateStory(storyId, body);
        sendResponse(res, httpStatusCodes.OK, story);
    }),

    deleteStory: asyncHandler(async (req, res) => {
        const { storyId } = getParams<{ storyId: string }>(req);
        await storyService.deleteStory(storyId);

        sendResponse(res, httpStatusCodes.OK, undefined);
    }),
};
