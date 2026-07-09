import { Router } from 'express';
import { StoryController } from '../controllers/storyController';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validate';
import {
    createStorySchema,
    updateStorySchema,
    storyIdParamSchema,
} from '../schemas/storySchema';
import { storyQuerySchema } from '../schemas/querySchema';
import { authenticate } from '../middlewares/authenticate';
import { requireOwnerOrAdmin } from '../middlewares/authorize';

const router = Router();

router.post(
    '/',
    validate(createStorySchema),
    asyncHandler(StoryController.createStory),
);
router.get(
    '/',
    validate(storyQuerySchema),
    asyncHandler(StoryController.getAllStories),
);
router.get(
    '/:storyId',
    authenticate,
    validate(storyIdParamSchema),
    asyncHandler(StoryController.getStoryById),
);
router.patch(
    '/:storyId',
    authenticate,
    requireOwnerOrAdmin('userId'),
    validate(updateStorySchema),
    asyncHandler(StoryController.updateStory),
);
router.delete(
    '/:storyId',
    authenticate,
    requireOwnerOrAdmin('userId'),
    validate(storyIdParamSchema),
    asyncHandler(StoryController.deleteStory),
);

export default router;
