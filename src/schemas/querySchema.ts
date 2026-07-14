import { z } from 'zod';
import { Pagination } from '../constants/schemaConstants';

export const paginationSchema = z.object({
    query: z.object({
        page: z.coerce
            .number()
            .int()
            .min(Pagination.PAGE, `Page must be at least ${Pagination.PAGE}`)
            .default(Pagination.PAGE),

        itemsPerPage: z.coerce
            .number()
            .int()
            .max(Pagination.MAX, `Max items per page is ${Pagination.MAX}`)
            .default(Pagination.ItemsPerPage),
    }),
});

export const userQuerySchema = paginationSchema.extend({
    query: paginationSchema.shape.query.extend({
        username: z.string().optional(),
        email: z.string().optional(),
        orderBy: z.enum(['joinDate', 'username', 'name']).default('joinDate'),
    }),
});

export const storyQuerySchema = paginationSchema.extend({
    query: paginationSchema.shape.query.extend({
        title: z.string().optional(),
        author: z.string().optional(),
        createdAt: z.string().optional(),
        category: z.string().optional(),
        orderBy: z.enum(['createdAt', 'title']).optional().default('createdAt'),
    }),
});

export type PaginationParams = z.infer<typeof paginationSchema>['query'];
export type UserQueryParams = z.infer<typeof userQuerySchema>['query'];
export type StoryQueryParams = z.infer<typeof storyQuerySchema>['query'];
