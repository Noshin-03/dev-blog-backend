import { z } from 'zod';
import { createUserSchema } from './userSchema';
import { PasswordValidation } from '../constants/schemaConstants';

const passwordSchema = z
    .string()
    .min(
        PasswordValidation.MIN,
        `Password must be at least ${PasswordValidation.MIN} characters`,
    )
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

export const registerSchema = z.object({
    body: z.object({
        username: createUserSchema.shape.body.shape.username,
        name: createUserSchema.shape.body.shape.name,
        email: z.email('Invalid email address'),
        password: passwordSchema,
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    }),
});

export const changePasswordSchema = z.object({
    body: z
        .object({
            oldPassword: z.string().min(1, 'Old password is required'),
            newPassword: passwordSchema,
        })
        .refine((data) => data.oldPassword !== data.newPassword, {
            message: 'New password must be different from the old password',
            path: ['newPassword'],
        }),
});

export const confirmEmailSchema = z.object({
    params: z.object({
        token: z.string().min(1, 'Token is required'),
    }),
});

export const resendVerificationSchema = z.object({
    body: z.object({
        email: z.email('Invalid email address'),
    }),
});
