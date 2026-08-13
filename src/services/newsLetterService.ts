import prisma from '../config/prisma';
import { NewsletterRepository } from '../repositories/newsLetterRepository';
import { SubscribeDTO, NewsletterSubscriberDTO } from '../dtos/newsLetterDTO';
import { Messages } from '../constants/messages';
import { NotFoundError, ValidationError } from '../common/errorsClass';
import { logger } from '../utils/logger';
import { signNewsletterToken, verifyNewsletterToken } from '../utils/jwt';
import {
    sendNewsletterConfirmationEmail,
    sendNewStoryNotificationEmail,
} from '../utils/mailer';

const newsletterRepository = new NewsletterRepository(prisma);

export class NewsletterService {
    async subscribe(data: SubscribeDTO): Promise<void> {
        const existing = await newsletterRepository.findByEmail(data.email);

        // Same "don't leak whether the email exists" shape as the auth
        // verification-email flow — the controller always returns the
        // generic NEWSLETTER_CONFIRMATION_SENT message regardless of branch.
        if (existing?.status === 'CONFIRMED') {
            return;
        }

        if (!existing) {
            await newsletterRepository.create(data.email);
        }

        const token = signNewsletterToken(data.email, 'newsletter-confirm');
        await sendNewsletterConfirmationEmail(data.email, token);
    }

    async confirmSubscription(token: string): Promise<void> {
        let payload;
        try {
            payload = verifyNewsletterToken(token);
        } catch {
            throw new ValidationError(Messages.NEWSLETTER_TOKEN_INVALID);
        }

        if (payload.purpose !== 'newsletter-confirm') {
            throw new ValidationError(Messages.NEWSLETTER_TOKEN_INVALID);
        }

        const subscriber = await newsletterRepository.findByEmail(
            payload.email,
        );
        if (!subscriber) {
            throw new NotFoundError(Messages.NEWSLETTER_SUBSCRIBER_NOT_FOUND);
        }

        if (subscriber.status === 'CONFIRMED') {
            return;
        }

        await newsletterRepository.markConfirmed(payload.email);
    }

    async unsubscribe(token: string): Promise<void> {
        let payload;
        try {
            payload = verifyNewsletterToken(token);
        } catch {
            throw new ValidationError(Messages.NEWSLETTER_TOKEN_INVALID);
        }

        if (payload.purpose !== 'newsletter-unsubscribe') {
            throw new ValidationError(Messages.NEWSLETTER_TOKEN_INVALID);
        }

        const subscriber = await newsletterRepository.findByEmail(
            payload.email,
        );
        if (!subscriber) {
            throw new NotFoundError(Messages.NEWSLETTER_SUBSCRIBER_NOT_FOUND);
        }

        await newsletterRepository.markUnsubscribed(payload.email);
    }

    async listSubscribers(): Promise<{
        items: NewsletterSubscriberDTO[];
        confirmedCount: number;
    }> {
        const [subscribers, confirmedCount] = await Promise.all([
            newsletterRepository.findAll(),
            newsletterRepository.count(),
        ]);

        return {
            items: subscribers.map((s) => new NewsletterSubscriberDTO(s)),
            confirmedCount,
        };
    }

    // Fire-and-forget from StoryService on publish. Intentionally never
    // throws — a notification failure should never fail story creation.
    // NOTE: for real production volume this should go through a queue
    // instead of an inline loop of sequential sends.
    async notifySubscribersOfNewStory(story: {
        storyId: string;
        title: string;
        summary: string | null;
    }): Promise<void> {
        try {
            const emails = await newsletterRepository.findAllConfirmedEmails();

            for (const email of emails) {
                const unsubscribeToken = signNewsletterToken(
                    email,
                    'newsletter-unsubscribe',
                );
                try {
                    await sendNewStoryNotificationEmail(
                        email,
                        story,
                        unsubscribeToken,
                    );
                } catch (err) {
                    logger.error('Failed to send newsletter email', {
                        email,
                        storyId: story.storyId,
                        error: err instanceof Error ? err.message : String(err),
                    });
                }
            }
        } catch (err) {
            logger.error('Failed to notify newsletter subscribers', {
                storyId: story.storyId,
                error: err instanceof Error ? err.message : String(err),
            });
        }
    }
}
