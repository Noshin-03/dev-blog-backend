import { Router } from 'express';
import { StoryController } from '../controllers/storyController';
import { asyncHandler } from '../utils/asyncHandler';
import {
    createStorySchema,
    updateStorySchema,
    storyIdParamSchema,
} from '../schemas/storySchema';
import { storyQuerySchema } from '../schemas/querySchema';
import { authenticate } from '../middlewares/authenticate';
import {
    requireOwnerOrAdmin,
    summaryRateLimit,
    validate,
} from '../middlewares';

const router = Router();

router.post(
    '/',
    authenticate,
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

router.post(
    '/:storyId/regenerate-summary',
    authenticate,
    summaryRateLimit,
    validate(storyIdParamSchema),
    asyncHandler(StoryController.regenerateSummary),
);

export default router;
