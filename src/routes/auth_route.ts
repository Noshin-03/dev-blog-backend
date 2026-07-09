import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../schemas/authSchema';

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

export default router;
