import prisma from '../config/prisma';
import { StoryRepository } from '../repositories/storyRepository';
import {
    CreateStoryDTO,
    UpdateStoryDTO,
    ListStoryDTO,
    StoryResponseDTO,
} from '../dtos/storyDTO';
import { Messages } from '../constants/messages';
import { NotFoundError } from '../common/errorsClass';
import { StoryQueryParams } from '../schemas/querySchema';
import { JwtPayload } from '../utils/jwt';
import { generateStorySummary } from '../services/aiService';

const storyRepository = new StoryRepository(prisma);

export class StoryService {
    async createStory(
        userId: string,
        data: CreateStoryDTO,
    ): Promise<StoryResponseDTO> {
        const story = await storyRepository.create(userId, data);

        if (data.autoSummarize) {
            const summary = await generateStorySummary(story.title, story.body);
            await storyRepository.storeSummary(story.storyId, summary);
            story.summary = summary;
        }

        return new StoryResponseDTO(story);
    }

    async getAllStories(
        params: StoryQueryParams,
    ): Promise<{ items: ListStoryDTO[]; total: number }> {
        const [stories, total] = await Promise.all([
            storyRepository.findAll(params),
            storyRepository.count(params),
        ]);

        return {
            items: stories.map((story) => new ListStoryDTO(story)),
            total,
        };
    }

    async getStoryById(storyId: string): Promise<StoryResponseDTO> {
        const story = await storyRepository.getById(storyId);

        if (!story) {
            throw new NotFoundError(Messages.STORY_NOT_FOUND);
        }

        return new StoryResponseDTO(story);
    }

    async regenerateSummary(
        storyId: string,
        requestingUser: JwtPayload,
    ): Promise<StoryResponseDTO> {
        const story = await storyRepository.getById(storyId);
        if (!story) {
            throw new NotFoundError(Messages.STORY_NOT_FOUND);
        }

        const summary = await generateStorySummary(story.title, story.body);

        const updated = await storyRepository.storeSummary(storyId, summary);

        return new StoryResponseDTO(updated);
    }

    async updateStory(
        storyId: string,
        data: UpdateStoryDTO,
    ): Promise<StoryResponseDTO> {
        const story = await storyRepository.getById(storyId);

        if (!story) {
            throw new NotFoundError(Messages.STORY_NOT_FOUND);
        }

        const updated = await storyRepository.update(storyId, data);

        const hasBodyChanged = data.body !== undefined;

        if (hasBodyChanged) {
            const summary = await generateStorySummary(
                updated.title,
                updated.body,
            );
            const withSummary = await storyRepository.storeSummary(
                updated.storyId,
                summary,
            );

            updated.summary = withSummary.summary;
        }

        return new StoryResponseDTO(updated);
    }

    async deleteStory(storyId: string): Promise<void> {
        const story = await storyRepository.getById(storyId);
        if (!story) {
            throw new NotFoundError(Messages.STORY_NOT_FOUND);
        }

        await storyRepository.delete(storyId);
    }
}
