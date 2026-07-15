import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { CategoryController } from '../controllers/categoryController';
import { requireAdmin, validate, authenticate } from '../middlewares';
import {
    categoryIdParamSchema,
    createCategorySchema,
    updateCategorySchema,
} from '../schemas/categorySchema';

const router = Router();

router.get('/', asyncHandler(CategoryController.getAllCategories));
router.get(
    '/:categoryId',
    validate(categoryIdParamSchema),
    asyncHandler(CategoryController.getCategoryById),
);
router.post(
    '/',
    authenticate,
    requireAdmin,
    validate(createCategorySchema),
    asyncHandler(CategoryController.createCategory),
);
router.patch(
    '/:categoryId',
    authenticate,
    requireAdmin,
    validate(updateCategorySchema),
    asyncHandler(CategoryController.updateCategory),
);
router.delete(
    '/:categoryId',
    authenticate,
    requireAdmin,
    validate(categoryIdParamSchema),
    asyncHandler(CategoryController.deleteCategory),
);

export default router;
