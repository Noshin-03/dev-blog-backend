import {
    registerSchema,
    loginSchema,
    changePasswordSchema,
    confirmEmailSchema,
    resendVerificationSchema,
} from '../schemas/authSchema';
import { z } from 'zod';

export type RegisterDTO = z.infer<typeof registerSchema>['body'];
export type LoginDto = z.infer<typeof loginSchema>['body'];
export type ChangepasswordDTO = z.infer<typeof changePasswordSchema>['body'];
export type ConfirmEmailDTO = z.infer<typeof confirmEmailSchema>['params'];
export type ResendVerificationDTO = z.infer<
    typeof resendVerificationSchema
>['body'];
