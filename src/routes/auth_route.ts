import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validate';
import {
    registerSchema,
    loginSchema,
    confirmEmailSchema,
} from '../schemas/authSchema';

const router = Router();

router.post(
    '/signup',
    validate(registerSchema),
    asyncHandler(AuthController.signup),
);
router.post(
    '/login',
    validate(loginSchema),
    asyncHandler(AuthController.login),
);
router.get(
    '/confirm-email/:token',
    validate(confirmEmailSchema),
    asyncHandler(AuthController.confirmEmail),
);

export default router;
