import prisma from '../config/prisma';
import { StoryRepository } from '../repositories/storyRepository';
import {
    CreateStoryDTO,
    UpdateStoryDTO,
    StoryResponseDTO,
} from '../dtos/storyDTO';
import { Messages } from '../constants/messages';
import {
    AiError,
    NotFoundError,
    UnauthorizedError,
} from '../common/errorsClass';
import { StoryQueryParams } from '../schemas/querySchema';
import { JwtPayload } from '../utils/jwt';
import { Role } from '@prisma/client';
import { generateStorySummary } from '../services/aiService';

const storyRepository = new StoryRepository(prisma);

export class StoryService {
    async createStory(data: CreateStoryDTO): Promise<StoryResponseDTO> {
        const story = await storyRepository.create(data);

        if (data.autoSummarize) {
            try {
                const summary = await generateStorySummary(
                    story.title,
                    story.body,
                );

                await storyRepository.updateSummary(story.storyId, summary);

                story.summary = summary;
            } catch (error) {
                if (!(error instanceof AiError)) {
                    throw error;
                }
            }
        }

        return new StoryResponseDTO(story);
    }

    async getAllStories(params: StoryQueryParams): Promise<StoryResponseDTO[]> {
        const stories = await storyRepository.findAll(params);
        return stories.map((story) => new StoryResponseDTO(story));
    }

    async getStoryById(id: string): Promise<StoryResponseDTO> {
        const story = await storyRepository.getById(id);

        if (!story) {
            throw new NotFoundError(Messages.STORY_NOT_FOUND);
        }

        return new StoryResponseDTO(story);
    }

    async regenerateSummary(
        id: string,
        requestingUser: JwtPayload,
    ): Promise<StoryResponseDTO> {
        const story = await storyRepository.getById(id);
        if (!story) {
            throw new NotFoundError(Messages.STORY_NOT_FOUND);
        }

        const isOwner = story.userId === requestingUser.userId;
        const isAdmin = requestingUser.role === Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedError(Messages.ADMIN_ONLY);
        }

        const summary = await generateStorySummary(story.title, story.body);

        const updated = await storyRepository.updateSummary(id, summary);

        return new StoryResponseDTO(updated);
    }

    async updateStory(
        id: string,
        data: UpdateStoryDTO,
        requestingUser: JwtPayload,
    ): Promise<StoryResponseDTO> {
        const story = await storyRepository.getById(id);

        if (!story) {
            throw new NotFoundError(Messages.STORY_NOT_FOUND);
        }

        const isOwner = story.userId === requestingUser.userId;
        const isAdmin = requestingUser.role === Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedError(Messages.UNAUTHORIZED);
        }

        const updated = await storyRepository.update(id, data);

        const autoSummarize = data.autoSummarize ?? story.autoSummarize;

        const shouldGenerateSummary =
            autoSummarize &&
            (data.title !== undefined || data.body !== undefined);

        if (shouldGenerateSummary) {
            try {
                const summary = await generateStorySummary(
                    updated.title,
                    updated.body,
                );

                await storyRepository.updateSummary(updated.storyId, summary);

                updated.summary = summary;
            } catch (error) {
                if (!(error instanceof AiError)) {
                    throw error;
                }
            }
        }
        return new StoryResponseDTO(updated);
    }

    async deleteStory(id: string, requestingUser: JwtPayload): Promise<void> {
        const story = await storyRepository.getById(id);
        if (!story) {
            throw new NotFoundError(Messages.STORY_NOT_FOUND);
        }

        const isOwner = story.userId === requestingUser.userId;
        const isAdmin = requestingUser.role === Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedError(Messages.UNAUTHORIZED);
        }

        await storyRepository.delete(id);
    }
}
