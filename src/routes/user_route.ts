import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validate';
import { createUserSchema, updateUserSchema } from '../schemas/userSchema';
import { idSchema } from '../schemas/idSchema';

const router = Router();

router.post(
    '/',
    validate(createUserSchema),
    asyncHandler(UserController.createUser),
);
router.get('/', asyncHandler(UserController.getAllUsers));
router.get(
    '/:userId',
    validate(idSchema),
    asyncHandler(UserController.getUserById),
);
router.patch(
    '/:userId',
    validate(updateUserSchema),
    asyncHandler(UserController.updateUser),
);
router.delete(
    '/:userId',
    validate(idSchema),
    asyncHandler(UserController.deleteUser),
);

export default router;
