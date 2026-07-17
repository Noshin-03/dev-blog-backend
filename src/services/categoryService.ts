import { ConflictError, NotFoundError } from '../common/errorsClass';
import prisma from '../config/prisma';
import {
    CategoryResponseDTO,
    CreateCategoryDTO,
    UpdateCategoryDTO,
} from '../dtos/categoryDTO';
import { CategoryRepository } from '../repositories/categoryRepository';
import { Messages } from '../constants/messages';

const categoryRepository = new CategoryRepository(prisma);

export class CategoryService {
    private async ensureCategoryExists(id: string): Promise<void> {
        const exists = await categoryRepository.checkById(id);
        if (!exists) {
            throw new NotFoundError(Messages.CATEGORY_NOT_FOUND);
        }
    }

    private async ensureNameIsUnique(
        name: string,
        excludeId?: string,
    ): Promise<void> {
        const existing = await categoryRepository.findByName(name);
        if (existing && existing.id !== excludeId) {
            throw new ConflictError(Messages.CATEGORY_ALREADY_EXISTS);
        }
    }

    async createCategory(
        data: CreateCategoryDTO,
    ): Promise<CategoryResponseDTO> {
        await this.ensureNameIsUnique(data.name);

        const category = await categoryRepository.create(data);
        return new CategoryResponseDTO(category);
    }

    async getAllCategories(): Promise<CategoryResponseDTO[]> {
        const categories = await categoryRepository.findAll();
        return categories.map((c) => new CategoryResponseDTO(c));
    }

    async getCategoryById(id: string): Promise<CategoryResponseDTO> {
        const category = await categoryRepository.findById(id);
        if (!category) {
            throw new NotFoundError(Messages.CATEGORY_NOT_FOUND);
        }
        return new CategoryResponseDTO(category);
    }

    async updateCategory(
        id: string,
        data: UpdateCategoryDTO,
    ): Promise<CategoryResponseDTO> {
        await this.ensureCategoryExists(id);

        if (data.name) {
            await this.ensureNameIsUnique(data.name, id);
        }

        const category = await categoryRepository.update(id, data);
        return new CategoryResponseDTO(category);
    }

    async deleteCategory(id: string): Promise<void> {
        await this.ensureCategoryExists(id);
        await categoryRepository.delete(id);
    }
}