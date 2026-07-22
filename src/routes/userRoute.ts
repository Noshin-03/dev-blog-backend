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

const router = Router();

router.post(
    '/',
    validate(createUserSchema),
    asyncHandler(UserController.createUser),
);
router.get(
    '/',
    validate(userQuerySchema),
    asyncHandler(UserController.getAllUsers),
);
router.get(
    '/:userId',
    validate(userIdParamSchema),
    asyncHandler(UserController.getUserById),
);
router.patch(
    '/:userId',
    validate(updateUserSchema),
    asyncHandler(UserController.updateUser),
);
router.delete(
    '/:userId',
    validate(userIdParamSchema),
    asyncHandler(UserController.deleteUser),
);

export default router;
