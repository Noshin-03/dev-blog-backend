import {
    registerSchema,
    loginSchema,
    changePasswordSchema,
} from '../schemas/authSchema';
import { z } from 'zod';

export type RegisterDTO = z.infer<typeof registerSchema>['body'];
export type LoginDto = z.infer<typeof loginSchema>['body'];
export type ChangepasswordDTO = z.infer<typeof changePasswordSchema>['body'];
