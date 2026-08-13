import { Router } from 'express';
import { NewsletterController } from '../controllers/newsLetterController';
import { asyncHandler } from '../utils/asyncHandler';
import {
    subscribeSchema,
    newsletterTokenParamSchema,
} from '../schemas/newsLetterSchema';
import { authenticate, authorize, validate } from '../middlewares';
import { newsletterRateLimit } from '../middlewares/newsLetterLimit';

const router = Router();

router.post(
    '/subscribe',
    newsletterRateLimit,
    validate(subscribeSchema),
    asyncHandler(NewsletterController.subscribe),
);

router.get(
    '/confirm/:token',
    validate(newsletterTokenParamSchema),
    asyncHandler(NewsletterController.confirmSubscription),
);

router.get(
    '/unsubscribe/:token',
    validate(newsletterTokenParamSchema),
    asyncHandler(NewsletterController.unsubscribe),
);

router.get(
    '/',
    authenticate,
    authorize({ resource: 'newsletter' }),
    asyncHandler(NewsletterController.listSubscribers),
);

export default router;
