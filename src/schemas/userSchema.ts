import { z } from 'zod';
import { UserValidation } from '../constants/schemaConstants';

export const idParamSchema = z.object({
    params: z.object({
        userId: z.uuid('Invalid id format'),
    }),
});

export const createUserSchema = z.object({
    body: z.object({
        username: z
            .string()
            .min(
                UserValidation.MIN,
                `Username must be at least ${UserValidation.MIN} characters`,
            )
            .max(
                UserValidation.MAX,
                `Username must be at most ${UserValidation.MAX} characters`,
            ),
        name: z
            .string()
            .min(
                UserValidation.MIN,
                `Name must be at least ${UserValidation.MIN} characters`,
            ),
        email: z.email('Invalid email address'),
        role: z.optional(z.enum(['ADMIN', 'USER'])),
    }),
});

export const updateUserSchema = z.object({
    params: idParamSchema.shape.params,
    body: createUserSchema.shape.body
        .partial()
        .refine((data) => Object.keys(data).length > 0, {
            message: 'At least one field must be provided to update',
        }),
});
