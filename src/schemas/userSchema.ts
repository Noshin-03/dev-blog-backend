import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        username: z
            .string()
            .min(3, 'Username must be at least 3 characters')
            .max(30, 'Username must be at most 30 characters'),
        name: z.string().min(3, 'Name must be at least 3 characters'),
        email: z.email(),
        role: z.optional(z.enum(['ADMIN', 'USER'])),
    }),
});

//for POST, PATCH
export const updateUserSchema = z.object({
    body: z
        .object({
            username: z.optional(z.string().min(3).max(30)),
            name: z.optional(z.string().min(3)),
            email: z.optional(z.email()),
            role: z.optional(z.enum(['ADMIN', 'USER'])),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: 'At least one field must be provided to update',
        }),
    params: z.object({
        userId: z.string().regex(/^\d+$/, 'userId must be a number'),
    }),
});

//for GET, DELETE
export const userIdParamSchema = z.object({
    params: z.object({
        userId: z.string().regex(/^\d+$/, 'userId must be a number'),
    }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
