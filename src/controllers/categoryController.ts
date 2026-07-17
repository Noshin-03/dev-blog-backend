import { CategoryService } from '../services/categoryService';
import { asyncHandler } from '../utils/asyncHandler';
import { httpStatusCodes } from '../constants/statusCode';
import { sendResponse } from '../utils/response';

const categoryService = new CategoryService();

export const CategoryController = {
    createCategory: asyncHandler(async (req, res) => {
        const category = await categoryService.createCategory(req.body);
        sendResponse(res, httpStatusCodes.CREATED, category);
    }),

    getAllCategories: asyncHandler(async (_req, res) => {
        const categories = await categoryService.getAllCategories();
        sendResponse(res, httpStatusCodes.OK, categories);
    }),

    getCategoryById: asyncHandler(async (req, res) => {
        const categoryId = req.params.categoryId as string;
        const category = await categoryService.getCategoryById(categoryId);
        sendResponse(res, httpStatusCodes.OK, category);
    }),

    updateCategory: asyncHandler(async (req, res) => {
        const categoryId = req.params.categoryId as string;
        const category = await categoryService.updateCategory(
            categoryId,
            req.body,
        );
        sendResponse(res, httpStatusCodes.OK, category);
    }),

    deleteCategory: asyncHandler(async (req, res) => {
        const categoryId = req.params.categoryId as string;
        await categoryService.deleteCategory(categoryId);
        sendResponse(res, httpStatusCodes.OK, undefined);
    }),
};
