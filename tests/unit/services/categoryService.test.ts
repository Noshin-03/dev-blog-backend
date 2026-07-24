import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ConflictError, NotFoundError } from '../../../src/common/errorsClass';
import { Messages } from '../../../src/constants/messages';
import { CategoryResponseDTO } from '../../../src/dtos/categoryDTO';
import type { CategoryRepositoryMock } from '../../mocks/repositories.mock';
import { createCategoryRepositoryMock } from '../../mocks/repositories.mock';

const mockCategoryRepo: CategoryRepositoryMock = createCategoryRepositoryMock();

jest.mock('../../../src/config/prisma', () => ({
    default: {},
}));

jest.mock('../../../src/repositories/categoryRepository', () => ({
    CategoryRepository: jest.fn(() => mockCategoryRepo),
}));

const buildCategory = (overrides: Record<string, unknown> = {}) => ({
    id: 'cat-1',
    name: 'Technology',
    description: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
});

describe('CategoryService', () => {
    let categoryService: any;

    beforeEach(async () => {
        jest.clearAllMocks();
        const { CategoryService } =
            await import('../../../src/services/categoryService');
        categoryService = new CategoryService();
    });

    describe('createCategory', () => {
        it('creates a category when the name is unique', async () => {
            mockCategoryRepo.findByName.mockResolvedValue(null);
            const created = buildCategory();
            mockCategoryRepo.create.mockResolvedValue(created);

            const result = await categoryService.createCategory({
                name: 'Technology',
            });

            expect(mockCategoryRepo.findByName).toHaveBeenCalledWith(
                'Technology',
            );
            expect(mockCategoryRepo.create).toHaveBeenCalledWith({
                name: 'Technology',
            });
            expect(result).toEqual(new CategoryResponseDTO(created));
        });

        it('throws ConflictError when a category with the same name already exists', async () => {
            mockCategoryRepo.findByName.mockResolvedValue(
                buildCategory({ id: 'existing-cat' }),
            );

            await expect(
                categoryService.createCategory({ name: 'Technology' }),
            ).rejects.toThrow(Messages.CATEGORY_ALREADY_EXISTS);
            await expect(
                categoryService.createCategory({ name: 'Technology' }),
            ).rejects.toBeInstanceOf(ConflictError);
            expect(mockCategoryRepo.create).not.toHaveBeenCalled();
        });
    });

    describe('getAllCategories', () => {
        it('maps repository results to CategoryResponseDTO[]', async () => {
            const categories = [
                buildCategory({ id: 'cat-1' }),
                buildCategory({ id: 'cat-2', name: 'Science' }),
            ];
            mockCategoryRepo.findAll.mockResolvedValue(categories);

            const result = await categoryService.getAllCategories();

            expect(result).toEqual(
                categories.map((c) => new CategoryResponseDTO(c)),
            );
        });

        it('returns an empty array when there are no categories', async () => {
            mockCategoryRepo.findAll.mockResolvedValue([]);

            const result = await categoryService.getAllCategories();

            expect(result).toEqual([]);
        });
    });

    describe('getCategoryById', () => {
        it('returns a CategoryResponseDTO when found', async () => {
            const category = buildCategory();
            mockCategoryRepo.findById.mockResolvedValue(category);

            const result = await categoryService.getCategoryById('cat-1');

            expect(mockCategoryRepo.findById).toHaveBeenCalledWith('cat-1');
            expect(result).toEqual(new CategoryResponseDTO(category));
        });

        it('throws NotFoundError when the category does not exist', async () => {
            mockCategoryRepo.findById.mockResolvedValue(null);

            await expect(
                categoryService.getCategoryById('missing-id'),
            ).rejects.toThrow(Messages.CATEGORY_NOT_FOUND);
            await expect(
                categoryService.getCategoryById('missing-id'),
            ).rejects.toBeInstanceOf(NotFoundError);
        });
    });

    describe('updateCategory', () => {
        it('throws NotFoundError when the category being updated does not exist', async () => {
            mockCategoryRepo.checkById.mockResolvedValue(false);

            await expect(
                categoryService.updateCategory('missing-id', {
                    name: 'New Name',
                }),
            ).rejects.toThrow(Messages.CATEGORY_NOT_FOUND);
            expect(mockCategoryRepo.update).not.toHaveBeenCalled();
        });

        it('skips the uniqueness check when the name is not being changed', async () => {
            mockCategoryRepo.checkById.mockResolvedValue(true);
            const updated = buildCategory({ id: 'cat-1' });
            mockCategoryRepo.update.mockResolvedValue(updated);

            const result = await categoryService.updateCategory('cat-1', {});

            expect(mockCategoryRepo.findByName).not.toHaveBeenCalled();
            expect(mockCategoryRepo.update).toHaveBeenCalledWith('cat-1', {});
            expect(result).toEqual(new CategoryResponseDTO(updated));
        });

        it('allows renaming to the same category (no self-conflict)', async () => {
            mockCategoryRepo.checkById.mockResolvedValue(true);
            mockCategoryRepo.findByName.mockResolvedValue(
                buildCategory({ id: 'cat-1' }),
            );
            const updated = buildCategory({ id: 'cat-1', name: 'Technology' });
            mockCategoryRepo.update.mockResolvedValue(updated);

            const result = await categoryService.updateCategory('cat-1', {
                name: 'Technology',
            });

            expect(mockCategoryRepo.update).toHaveBeenCalledWith('cat-1', {
                name: 'Technology',
            });
            expect(result).toEqual(new CategoryResponseDTO(updated));
        });

        it('throws ConflictError when renaming to a name already used by another category', async () => {
            mockCategoryRepo.checkById.mockResolvedValue(true);
            mockCategoryRepo.findByName.mockResolvedValue(
                buildCategory({ id: 'other-cat' }),
            );

            await expect(
                categoryService.updateCategory('cat-1', { name: 'Taken' }),
            ).rejects.toThrow(Messages.CATEGORY_ALREADY_EXISTS);
            await expect(
                categoryService.updateCategory('cat-1', { name: 'Taken' }),
            ).rejects.toBeInstanceOf(ConflictError);
            expect(mockCategoryRepo.update).not.toHaveBeenCalled();
        });
    });

    describe('deleteCategory', () => {
        it('deletes the category when it exists', async () => {
            mockCategoryRepo.checkById.mockResolvedValue(true);
            mockCategoryRepo.delete.mockResolvedValue(undefined as any);

            await categoryService.deleteCategory('cat-1');

            expect(mockCategoryRepo.checkById).toHaveBeenCalledWith('cat-1');
            expect(mockCategoryRepo.delete).toHaveBeenCalledWith('cat-1');
        });

        it('throws NotFoundError and never calls delete when the category does not exist', async () => {
            mockCategoryRepo.checkById.mockResolvedValue(false);

            await expect(
                categoryService.deleteCategory('missing-id'),
            ).rejects.toThrow(Messages.CATEGORY_NOT_FOUND);
            expect(mockCategoryRepo.delete).not.toHaveBeenCalled();
        });
    });
});
