import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { CategoryController } from '../controllers/categoryController';
import { authorize, validate, authenticate } from '../middlewares';
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
    authorize({ resource: 'category' }),
    validate(createCategorySchema),
    asyncHandler(CategoryController.createCategory),
);
router.patch(
    '/:categoryId',
    authenticate,
    authorize({ resource: 'category' }),
    validate(updateCategorySchema),
    asyncHandler(CategoryController.updateCategory),
);
router.delete(
    '/:categoryId',
    authenticate,
    authorize({ resource: 'category' }),
    validate(categoryIdParamSchema),
    asyncHandler(CategoryController.deleteCategory),
);

export default router;
