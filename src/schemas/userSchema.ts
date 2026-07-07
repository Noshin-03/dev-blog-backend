import { z } from 'zod';
import { idParamSchema } from './idSchema';

const NAME_MIN = 3;
const NAME_MAX = 30;

export const createUserSchema = z.object({
    body: z.object({
        username: z
            .string()
            .min(NAME_MIN, `Username must be at least ${NAME_MIN} characters`)
            .max(NAME_MAX, `Username must be at most ${NAME_MAX} characters`),
        name: z
            .string()
            .min(NAME_MIN, `Name must be at least ${NAME_MIN} characters`),
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

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
