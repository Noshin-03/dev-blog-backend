import type { Request } from 'express';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { httpStatusCodes } from '../../../src/constants/statusCode';
import { createMockRes } from '../../utils/express.mock';
import type { CategoryServiceMock } from '../../mocks/services.mock';
import { createCategoryServiceMock } from '../../mocks/services.mock';

const mockCategoryService: CategoryServiceMock = createCategoryServiceMock();

jest.mock('../../../src/services/categoryService', () => ({
    CategoryService: jest.fn(() => mockCategoryService),
}));

import { CategoryController } from '../../../src/controllers/categoryController';

// NOTE: CategoryController itself has no admin/role check inline -- the
// "only admin can create/update/delete" rule must be enforced by route
// middleware (e.g. requireRole('ADMIN')) applied before these handlers run.
// These controller tests only verify the handler <-> service wiring; they
// do not and cannot verify the admin restriction. That needs a dedicated
// middleware test or a route-level integration test.

const buildCategoryDTO = (overrides: Record<string, unknown> = {}) => ({
    id: 'cat-1',
    name: 'Technology',
    ...overrides,
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('CategoryController', () => {
    describe('createCategory', () => {
        it('creates a category and returns 201', async () => {
            const category = buildCategoryDTO();
            mockCategoryService.createCategory.mockResolvedValue(
                category as any,
            );

            const req = { body: { name: 'Technology' } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await CategoryController.createCategory(req, res, next);

            expect(mockCategoryService.createCategory).toHaveBeenCalledWith(
                req.body,
            );
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.CREATED);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: category,
            });
        });

        it('forwards service errors to next (e.g. duplicate name)', async () => {
            const error = new Error('category already exists');
            mockCategoryService.createCategory.mockRejectedValue(error);

            const req = { body: { name: 'Technology' } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await CategoryController.createCategory(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('getAllCategories', () => {
        it('returns 200 with the full category list', async () => {
            const categories = [
                buildCategoryDTO({ id: 'cat-1' }),
                buildCategoryDTO({ id: 'cat-2', name: 'Science' }),
            ];
            mockCategoryService.getAllCategories.mockResolvedValue(
                categories as any,
            );

            const req = {} as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await CategoryController.getAllCategories(req, res, next);

            expect(mockCategoryService.getAllCategories).toHaveBeenCalledWith();
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: categories,
            });
        });

        it('forwards service errors to next', async () => {
            const error = new Error('boom');
            mockCategoryService.getAllCategories.mockRejectedValue(error);

            const req = {} as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await CategoryController.getAllCategories(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('getCategoryById', () => {
        it('returns 200 with the requested category', async () => {
            const category = buildCategoryDTO();
            mockCategoryService.getCategoryById.mockResolvedValue(
                category as any,
            );

            const req = {
                params: { categoryId: 'cat-1' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await CategoryController.getCategoryById(req, res, next);

            expect(mockCategoryService.getCategoryById).toHaveBeenCalledWith(
                'cat-1',
            );
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: category,
            });
        });

        it('forwards a not-found error to next', async () => {
            const error = new Error('category not found');
            mockCategoryService.getCategoryById.mockRejectedValue(error);

            const req = {
                params: { categoryId: 'missing-id' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await CategoryController.getCategoryById(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('updateCategory', () => {
        it('updates the category and returns 200', async () => {
            const updated = buildCategoryDTO({ name: 'Updated Name' });
            mockCategoryService.updateCategory.mockResolvedValue(
                updated as any,
            );

            const req = {
                params: { categoryId: 'cat-1' },
                body: { name: 'Updated Name' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await CategoryController.updateCategory(req, res, next);

            expect(mockCategoryService.updateCategory).toHaveBeenCalledWith(
                'cat-1',
                req.body,
            );
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: updated,
            });
        });

        it('forwards service errors to next', async () => {
            const error = new Error('category already exists');
            mockCategoryService.updateCategory.mockRejectedValue(error);

            const req = {
                params: { categoryId: 'cat-1' },
                body: { name: 'Taken' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await CategoryController.updateCategory(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('deleteCategory', () => {
        it('deletes the category and returns 200', async () => {
            mockCategoryService.deleteCategory.mockResolvedValue(
                undefined as any,
            );

            const req = {
                params: { categoryId: 'cat-1' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await CategoryController.deleteCategory(req, res, next);

            expect(mockCategoryService.deleteCategory).toHaveBeenCalledWith(
                'cat-1',
            );
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: undefined,
            });
        });

        it('forwards a not-found error to next and never calls res.json', async () => {
            const error = new Error('category not found');
            mockCategoryService.deleteCategory.mockRejectedValue(error);

            const req = {
                params: { categoryId: 'missing-id' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await CategoryController.deleteCategory(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.json).not.toHaveBeenCalled();
        });
    });
});
