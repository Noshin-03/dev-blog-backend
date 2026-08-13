import { NewsletterService } from '../services/newsLetterService';
import { asyncHandler } from '../utils/asyncHandler';
import { httpStatusCodes } from '../constants/statusCode';
import { sendResponse } from '../utils/response';
import { Messages } from '../constants/messages';

const newsletterService = new NewsletterService();

export const NewsletterController = {
    subscribe: asyncHandler(async (req, res) => {
        await newsletterService.subscribe(req.body);
        sendResponse(
            res,
            httpStatusCodes.OK,
            undefined,
            Messages.NEWSLETTER_CONFIRMATION_SENT,
        );
    }),

    confirmSubscription: asyncHandler(async (req, res) => {
        const token = req.params.token as string;
        await newsletterService.confirmSubscription(token);
        sendResponse(
            res,
            httpStatusCodes.OK,
            undefined,
            Messages.NEWSLETTER_CONFIRMED,
        );
    }),

    unsubscribe: asyncHandler(async (req, res) => {
        const token = req.params.token as string;
        await newsletterService.unsubscribe(token);
        sendResponse(
            res,
            httpStatusCodes.OK,
            undefined,
            Messages.NEWSLETTER_UNSUBSCRIBED,
        );
    }),

    listSubscribers: asyncHandler(async (_req, res) => {
        const result = await newsletterService.listSubscribers();
        sendResponse(res, httpStatusCodes.OK, result);
    }),
};
