import { Router } from 'express';
import { StoryController } from '../controllers/storyController';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validate';
import { createStorySchema, updateStorySchema } from '../schemas/storySchema';
import { idSchema } from '../schemas/idSchema';
import { storyQuerySchema } from '../schemas/querySchema';

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
    validate(idSchema),
    asyncHandler(StoryController.getStoryById),
);
router.patch(
    '/:storyId',
    validate(updateStorySchema),
    asyncHandler(StoryController.updateStory),
);
router.delete(
    '/:storyId',
    validate(idSchema),
    asyncHandler(StoryController.deleteStory),
);

export default router;
