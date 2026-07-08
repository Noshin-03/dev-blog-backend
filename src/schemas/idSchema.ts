import { z } from 'zod';

export const idSchema = z.uuid({
    message: 'Invalid id',
});
