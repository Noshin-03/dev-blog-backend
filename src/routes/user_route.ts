import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { asyncHandler } from '../utils/asyncHandler';
import {
    createUserSchema,
    updateProfileSchema,
    updateUserSchema,
    userIdParamSchema,
} from '../schemas/userSchema';
import { userQuerySchema } from '../schemas/querySchema';
import { authenticate } from '../middlewares/authenticate';
import { authorize, validate } from '../middlewares';

const router = Router();

router.get(
    '/',
    authenticate,
    authorize(),
    validate(userQuerySchema),
    asyncHandler(UserController.getAllUsers),
);

router.get('/profile', authenticate, asyncHandler(UserController.getProfile));

router.get(
    '/:userId',
    authenticate,
    validate(userIdParamSchema),
    asyncHandler(UserController.getUserById),
);

router.patch(
    '/profile',
    authenticate,
    validate(updateProfileSchema),
    asyncHandler(UserController.updateProfile),
);

router.patch(
    '/:userId',
    authenticate,
    authorize({
        getResourceOwnerId: (req) =>
            Promise.resolve(req.params.userId as string),
    }),
    validate(updateUserSchema),
    asyncHandler(UserController.updateUser),
);
router.delete(
    '/:userId',
    authenticate,
    authorize({
        getResourceOwnerId: (req) =>
            Promise.resolve(req.params.userId as string),
    }),
    validate(userIdParamSchema),
    asyncHandler(UserController.deleteUser),
);

export default router;
