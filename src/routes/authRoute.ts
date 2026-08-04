import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validate';
import {
    registerSchema,
    loginSchema,
    confirmEmailSchema,
    resendVerificationSchema,
    changePasswordSchema,
    confirmPasswordChangeSchema,
} from '../schemas/authSchema';
import { authenticate } from '../middlewares';

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

router.post(
    '/resend-verification',
    validate(resendVerificationSchema),
    asyncHandler(AuthController.resendVerification),
);

router.post(
    '/change-password',
    authenticate,
    validate(changePasswordSchema),
    asyncHandler(AuthController.changePassword),
);

router.post(
    '/confirm-password-change',
    authenticate,
    validate(confirmPasswordChangeSchema),
    asyncHandler(AuthController.confirmPasswordChange),
);

router.post('/logout', asyncHandler(AuthController.logout));

export default router;
