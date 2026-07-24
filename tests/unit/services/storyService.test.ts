import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { NotFoundError } from '../../../src/common/errorsClass';
import { Messages } from '../../../src/constants/messages';
import { StoryResponseDTO, ListStoryDTO } from '../../../src/dtos/storyDTO';
import type { StoryRepositoryMock } from '../../mocks/repositories.mock';
import { createStoryRepositoryMock } from '../../mocks/repositories.mock';

const mockStoryRepo: StoryRepositoryMock = createStoryRepositoryMock();
const generateStorySummaryMock =
    jest.fn<(title: string, body: string) => Promise<string>>();
jest.mock('../../../src/config/prisma', () => ({
    __esModule: true,
    default: {},
}));

jest.mock('../../../src/repositories/storyRepository', () => ({
    StoryRepository: jest.fn(() => mockStoryRepo),
}));

jest.mock('../../../src/services/aiService', () => ({
    generateStorySummary: generateStorySummaryMock,
}));

const buildStory = (overrides: Record<string, unknown> = {}) => ({
    storyId: 's-1',
    userId: 'u-1',
    title: 'Hello',
    body: 'World',
    autoSummarize: false,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    summary: null,
    ...overrides,
});

describe('StoryService', () => {
    let storyService: any;

    beforeEach(async () => {
        jest.clearAllMocks();
        const { StoryService } =
            await import('../../../src/services/storyService');
        storyService = new StoryService();
    });

    describe('createStory', () => {
        it('creates a story and generates a summary when autoSummarize is true', async () => {
            const story = buildStory();
            mockStoryRepo.create.mockResolvedValue(story);
            generateStorySummaryMock.mockResolvedValue('A summary');

            const result = await storyService.createStory('u-1', {
                title: 'Hello',
                body: 'World',
                autoSummarize: true,
            } as any);

            expect(mockStoryRepo.create).toHaveBeenCalledWith(
                'u-1',
                expect.any(Object),
            );
            expect(generateStorySummaryMock).toHaveBeenCalledWith(
                'Hello',
                'World',
            );
            expect(mockStoryRepo.storeSummary).toHaveBeenCalledWith(
                's-1',
                'A summary',
            );
            expect(result).toEqual(
                expect.objectContaining({ id: 's-1', summary: 'A summary' }),
            );
        });

        it('does not generate a summary when autoSummarize is false', async () => {
            const story = buildStory();
            mockStoryRepo.create.mockResolvedValue(story);

            const result = await storyService.createStory('u-1', {
                title: 'Hello',
                body: 'World',
                autoSummarize: false,
            } as any);

            expect(generateStorySummaryMock).not.toHaveBeenCalled();
            expect(mockStoryRepo.storeSummary).not.toHaveBeenCalled();
            expect(result).toEqual(new StoryResponseDTO(story));
        });
    });

    describe('getAllStories', () => {
        it('maps repository results to ListStoryDTO[]', async () => {
            const stories = [
                buildStory({ storyId: 's-1' }),
                buildStory({ storyId: 's-2', title: 'Second' }),
            ];
            mockStoryRepo.findAll.mockResolvedValue(stories);

            const params = {
                page: 1,
                itemsPerPage: 10,
                orderBy: 'createdAt',
            } as any;
            const result = await storyService.getAllStories(params);

            expect(mockStoryRepo.findAll).toHaveBeenCalledWith(params);
            expect(result).toEqual(stories.map((s) => new ListStoryDTO(s)));
        });

        it('returns an empty array when there are no stories', async () => {
            mockStoryRepo.findAll.mockResolvedValue([]);

            const result = await storyService.getAllStories({
                page: 1,
                itemsPerPage: 10,
            } as any);

            expect(result).toEqual([]);
        });
    });

    describe('getStoryById', () => {
        it('returns a StoryResponseDTO when the story exists', async () => {
            const story = buildStory();
            mockStoryRepo.getById.mockResolvedValue(story);

            const result = await storyService.getStoryById('s-1');

            expect(mockStoryRepo.getById).toHaveBeenCalledWith('s-1');
            expect(result).toEqual(new StoryResponseDTO(story));
        });

        it('throws NotFoundError when a story does not exist', async () => {
            mockStoryRepo.getById.mockResolvedValue(null);

            await expect(storyService.getStoryById('missing')).rejects.toThrow(
                Messages.STORY_NOT_FOUND,
            );
            await expect(
                storyService.getStoryById('missing'),
            ).rejects.toBeInstanceOf(NotFoundError);
        });
    });

    describe('regenerateSummary', () => {
        const requestingUser = {
            userId: 'u-1',
            username: 'tester',
            email: 'a@b.com',
            role: 'USER',
        } as any;

        it('regenerates and stores a new summary for an existing story', async () => {
            const story = buildStory();
            const updated = { ...story, summary: 'Regenerated summary' };
            mockStoryRepo.getById.mockResolvedValue(story);
            generateStorySummaryMock.mockResolvedValue('Regenerated summary');
            mockStoryRepo.storeSummary.mockResolvedValue(updated);

            const result = await storyService.regenerateSummary(
                's-1',
                requestingUser,
            );

            expect(mockStoryRepo.getById).toHaveBeenCalledWith('s-1');
            expect(generateStorySummaryMock).toHaveBeenCalledWith(
                'Hello',
                'World',
            );
            expect(mockStoryRepo.storeSummary).toHaveBeenCalledWith(
                's-1',
                'Regenerated summary',
            );
            expect(result).toEqual(new StoryResponseDTO(updated));
        });

        it('throws NotFoundError and never calls the AI service when the story does not exist', async () => {
            mockStoryRepo.getById.mockResolvedValue(null);

            await expect(
                storyService.regenerateSummary('missing', requestingUser),
            ).rejects.toThrow(Messages.STORY_NOT_FOUND);
            await expect(
                storyService.regenerateSummary('missing', requestingUser),
            ).rejects.toBeInstanceOf(NotFoundError);
            expect(generateStorySummaryMock).not.toHaveBeenCalled();
            expect(mockStoryRepo.storeSummary).not.toHaveBeenCalled();
        });
    });

    describe('updateStory', () => {
        it('throws NotFoundError when the story being updated does not exist', async () => {
            mockStoryRepo.getById.mockResolvedValue(null);

            await expect(
                storyService.updateStory('missing', {
                    title: 'New title',
                } as any),
            ).rejects.toThrow(Messages.STORY_NOT_FOUND);
            expect(mockStoryRepo.update).not.toHaveBeenCalled();
        });

        it('does not regenerate the summary when the body is unchanged', async () => {
            const existing = buildStory();
            const updated = { ...existing, title: 'New title' };
            mockStoryRepo.getById.mockResolvedValue(existing);
            mockStoryRepo.update.mockResolvedValue(updated);

            const result = await storyService.updateStory('s-1', {
                title: 'New title',
            } as any);

            expect(mockStoryRepo.update).toHaveBeenCalledWith('s-1', {
                title: 'New title',
            });
            expect(generateStorySummaryMock).not.toHaveBeenCalled();
            expect(mockStoryRepo.storeSummary).not.toHaveBeenCalled();
            expect(result).toEqual(new StoryResponseDTO(updated));
        });

        it('regenerates the summary when the body changes', async () => {
            const existing = buildStory();
            const updated = { ...existing, body: 'New body', summary: null };
            const withSummary = { ...updated, summary: 'New summary' };

            mockStoryRepo.getById.mockResolvedValue(existing);
            mockStoryRepo.update.mockResolvedValue(updated);
            mockStoryRepo.storeSummary.mockResolvedValue(withSummary);
            generateStorySummaryMock.mockResolvedValue('New summary');

            const result = await storyService.updateStory('s-1', {
                body: 'New body',
            } as any);

            expect(generateStorySummaryMock).toHaveBeenCalledWith(
                'Hello',
                'New body',
            );
            expect(mockStoryRepo.storeSummary).toHaveBeenCalledWith(
                's-1',
                'New summary',
            );
            expect(result).toBeInstanceOf(StoryResponseDTO);
            expect(result.summary).toBe('New summary');
        });
    });

    describe('deleteStory', () => {
        it('deletes the story when it exists', async () => {
            const story = buildStory();
            mockStoryRepo.getById.mockResolvedValue(story);
            mockStoryRepo.delete.mockResolvedValue(undefined as any);

            await storyService.deleteStory('s-1');

            expect(mockStoryRepo.getById).toHaveBeenCalledWith('s-1');
            expect(mockStoryRepo.delete).toHaveBeenCalledWith('s-1');
        });

        it('throws NotFoundError and never calls delete when the story does not exist', async () => {
            mockStoryRepo.getById.mockResolvedValue(null);

            await expect(storyService.deleteStory('missing')).rejects.toThrow(
                Messages.STORY_NOT_FOUND,
            );
            await expect(
                storyService.deleteStory('missing'),
            ).rejects.toBeInstanceOf(NotFoundError);
            expect(mockStoryRepo.delete).not.toHaveBeenCalled();
        });
    });
});
