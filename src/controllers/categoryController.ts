import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import { asyncHandler } from '../utils/asyncHandler';
import { httpStatusCodes } from '../constants/statusCode';
import { sendResponse } from '../utils/response';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../dtos/categoryDTO';

//TODO: fix the controller after pr resolve of issue-8s
type CategoryParams = { categoryId: string };

const getValidatedBody = <T>(req: Request): T => req.body as T;
const getValidatedParams = <T extends Record<string, string>>(
    req: Request,
): T => req.params as T;

const categoryService = new CategoryService();

export const CategoryController = {
    createCategory: asyncHandler(async (req: Request, res: Response) => {
        const body = getValidatedBody<CreateCategoryDTO>(req);
        const category = await categoryService.createCategory(body);
        sendResponse(res, httpStatusCodes.CREATED, category);
    }),

    getAllCategories: asyncHandler(async (_req: Request, res: Response) => {
        const categories = await categoryService.getAllCategories();
        sendResponse(res, httpStatusCodes.OK, categories);
    }),

    getCategoryById: asyncHandler(async (req: Request, res: Response) => {
        const { categoryId } = getValidatedParams<CategoryParams>(req);
        const category = await categoryService.getCategoryById(categoryId);
        sendResponse(res, httpStatusCodes.OK, category);
    }),

    updateCategory: asyncHandler(async (req: Request, res: Response) => {
        const { categoryId } = getValidatedParams<CategoryParams>(req);
        const body = getValidatedBody<UpdateCategoryDTO>(req);
        const category = await categoryService.updateCategory(categoryId, body);
        sendResponse(res, httpStatusCodes.OK, category);
    }),

    deleteCategory: asyncHandler(async (req: Request, res: Response) => {
        const { categoryId } = getValidatedParams<CategoryParams>(req);
        await categoryService.deleteCategory(categoryId);
        sendResponse(res, httpStatusCodes.OK, undefined);
    }),
};
