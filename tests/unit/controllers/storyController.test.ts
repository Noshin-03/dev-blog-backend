import type { Request } from 'express';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { httpStatusCodes } from '../../../src/constants/statusCode';
import { createMockRes } from '../../utils/express.mock';
import type { StoryServiceMock } from '../../mocks/services.mock';
import { createStoryServiceMock } from '../../mocks/services.mock';

const mockStoryService: StoryServiceMock = createStoryServiceMock();

jest.mock('../../../src/services/storyService', () => ({
    StoryService: jest.fn(() => mockStoryService),
}));

import { StoryController } from '../../../src/controllers/storyController';

const buildStoryDTO = (overrides: Record<string, unknown> = {}) => ({
    id: 's-1',
    title: 'Example story',
    body: 'Once upon a time',
    ...overrides,
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('StoryController', () => {
    describe('createStory', () => {
        it('creates a story and returns 201 with the service payload', async () => {
            const story = buildStoryDTO();
            mockStoryService.createStory.mockResolvedValue(story as any);

            const req = {
                user: { userId: 'u-1' },
                body: { title: 'Example story' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await StoryController.createStory(req, res, next);

            expect(mockStoryService.createStory).toHaveBeenCalledWith(
                'u-1',
                req.body,
            );
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.CREATED);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: story,
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('forwards service errors to next', async () => {
            const error = new Error('boom');
            mockStoryService.createStory.mockRejectedValue(error);

            const req = {
                user: { userId: 'u-1' },
                body: { title: 'Example story' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await StoryController.createStory(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('getAllStories', () => {
        it('returns all stories for the validated query', async () => {
            const stories = [
                buildStoryDTO({ id: 's-1' }),
                buildStoryDTO({ id: 's-2' }),
            ];
            const query = {
                page: 1,
                itemsPerPage: 10,
                orderBy: 'createdAt',
                title: 'story',
            } as const;
            mockStoryService.getAllStories.mockResolvedValue(stories as any);

            const req = { validated: { query } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await StoryController.getAllStories(req, res, next);

            expect(mockStoryService.getAllStories).toHaveBeenCalledWith(query);
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: stories,
            });
        });

        it('forwards service errors to next', async () => {
            const error = new Error('boom');
            mockStoryService.getAllStories.mockRejectedValue(error);

            const req = { validated: { query: {} } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await StoryController.getAllStories(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('getStoryById', () => {
        it('returns 200 with the requested story', async () => {
            const story = buildStoryDTO();
            mockStoryService.getStoryById.mockResolvedValue(story as any);

            const req = { params: { storyId: 's-1' } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await StoryController.getStoryById(req, res, next);

            expect(mockStoryService.getStoryById).toHaveBeenCalledWith('s-1');
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: story,
            });
        });

        it('passes service errors to next for a failed lookup', async () => {
            const error = new Error('boom');
            mockStoryService.getStoryById.mockRejectedValue(error);

            const req = { params: { storyId: 's-1' } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await StoryController.getStoryById(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('regenerateSummary', () => {
        it('regenerates the summary and returns 200', async () => {
            const story = buildStoryDTO({ summary: 'Regenerated' });
            mockStoryService.regenerateSummary.mockResolvedValue(story as any);

            const requestingUser = {
                userId: 'u-1',
                username: 'tester',
                email: 'a@b.com',
                role: 'USER' as const,
            };
            const req = {
                params: { storyId: 's-1' },
                user: requestingUser,
            } as unknown as Request;

            const res = createMockRes();
            const next = jest.fn();

            await StoryController.regenerateSummary(req, res, next);

            expect(mockStoryService.regenerateSummary).toHaveBeenCalledWith(
                's-1',
                requestingUser,
            );
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: story,
            });
        });

        it('forwards service errors to next', async () => {
            const error = new Error('story not found');
            mockStoryService.regenerateSummary.mockRejectedValue(error);

            const req = {
                params: { storyId: 'missing-id' },
                user: {
                    userId: 'u-1',
                    username: 'tester',
                    email: 'a@b.com',
                    role: 'USER',
                },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await StoryController.regenerateSummary(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('updateStory', () => {
        it('updates the story and returns 200', async () => {
            const updated = buildStoryDTO({ title: 'Updated title' });
            mockStoryService.updateStory.mockResolvedValue(updated as any);

            const req = {
                params: { storyId: 's-1' },
                body: { title: 'Updated title' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await StoryController.updateStory(req, res, next);

            expect(mockStoryService.updateStory).toHaveBeenCalledWith(
                's-1',
                req.body,
            );
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: updated,
            });
        });

        it('forwards service errors to next', async () => {
            const error = new Error('story not found');
            mockStoryService.updateStory.mockRejectedValue(error);

            const req = {
                params: { storyId: 'missing-id' },
                body: { title: 'Updated title' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await StoryController.updateStory(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('deleteStory', () => {
        it('deletes the story and returns 200', async () => {
            mockStoryService.deleteStory.mockResolvedValue(undefined as any);

            const req = { params: { storyId: 's-1' } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await StoryController.deleteStory(req, res, next);

            expect(mockStoryService.deleteStory).toHaveBeenCalledWith('s-1');
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: undefined,
            });
        });

        it('forwards a not-found error to next and never calls res.json', async () => {
            const error = new Error('story not found');
            mockStoryService.deleteStory.mockRejectedValue(error);

            const req = {
                params: { storyId: 'missing-id' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await StoryController.deleteStory(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.json).not.toHaveBeenCalled();
        });
    });
});
