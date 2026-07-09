import prisma from '../config/prisma';
import { StoryRepository } from '../repositories/storyRepository';
import {
    CreateStoryDTO,
    UpdateStoryDTO,
    StoryResponseDTO,
} from '../dtos/storyDTO';
import { Messages } from '../constants/messages';
import { NotFoundError, UnauthorizedError } from '../common/errorsClass';
import { StoryQueryParams } from '../schemas/querySchema';
import { JwtPayload } from '../utils/jwt';
import { Role } from '@prisma/client';

const storyRepository = new StoryRepository(prisma);

export class StoryService {
    async createStory(data: CreateStoryDTO): Promise<StoryResponseDTO> {
        const story = await storyRepository.create(data);
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
