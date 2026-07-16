import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validate';
import {
    createUserSchema,
    updateUserSchema,
    userIdParamSchema,
} from '../schemas/userSchema';
import { userQuerySchema } from '../schemas/querySchema';
import { authenticate } from '../middlewares/authenticate';
import { requireOwnerOrAdmin, requireAdmin } from '../middlewares/authorize';

const router = Router();

router.get(
    '/',
    authenticate,
    requireAdmin,
    validate(userQuerySchema),
    asyncHandler(UserController.getAllUsers),
);
router.get(
    '/:userId',
    authenticate,
    validate(userIdParamSchema),
    asyncHandler(UserController.getUserById),
);
router.patch(
    '/:userId',
    authenticate,
    requireOwnerOrAdmin('userId'),
    validate(updateUserSchema),
    asyncHandler(UserController.updateUser),
);
router.delete(
    '/:userId',
    authenticate,
    requireOwnerOrAdmin('userId'),
    validate(userIdParamSchema),
    asyncHandler(UserController.deleteUser),
);

export default router;
