import { Router } from 'express';
import { StoryController } from '../controllers/storyController';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validate';
import {
    createStorySchema,
    updateStorySchema,
    storyIdParamSchema,
} from '../schemas/storySchema';

const router = Router();

router.post(
    '/',
    validate(createStorySchema),
    asyncHandler(StoryController.createStory),
);
router.get('/', asyncHandler(StoryController.getAllStories));
router.get(
    '/:storyId',
    validate(storyIdParamSchema),
    asyncHandler(StoryController.getStoryById),
);
router.patch(
    '/:storyId',
    validate(updateStorySchema),
    asyncHandler(StoryController.updateStory),
);
router.delete(
    '/:storyId',
    validate(storyIdParamSchema),
    asyncHandler(StoryController.deleteStory),
);

export default router;
