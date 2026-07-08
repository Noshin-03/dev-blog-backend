import prisma from '../config/prisma';
import { StoryRepository } from '../repositories/storyRepository';
import {
    CreateStoryDTO,
    UpdateStoryDTO,
    StoryResponseDTO,
} from '../dtos/storyDTO';
import { Messages } from '../constants/messages';
import { NotFoundError } from '../common/errorsClass';

const storyRepository = new StoryRepository(prisma);

export class StoryService {
    async createStory(data: CreateStoryDTO): Promise<StoryResponseDTO> {
        const story = await storyRepository.create(data);
        return new StoryResponseDTO(story);
    }

    async getAllStories(): Promise<StoryResponseDTO[]> {
        const stories = await storyRepository.findAll();
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
    ): Promise<StoryResponseDTO> {
        const exists = await storyRepository.checkById(id);
        if (!exists) {
            throw new NotFoundError(Messages.STORY_NOT_FOUND);
        }
        const updated = await storyRepository.update(id, data);
        return new StoryResponseDTO(updated);
    }

    async deleteStory(id: string): Promise<void> {
        const exists = await storyRepository.checkById(id);
        if (!exists) {
            throw new NotFoundError(Messages.STORY_NOT_FOUND);
        }
        await storyRepository.delete(id);
    }
}
