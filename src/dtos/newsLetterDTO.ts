import { NewsletterSubscriber } from '@prisma/client';
import { z } from 'zod';
import { subscribeSchema } from '../schemas/newsLetterSchema';

export type SubscribeDTO = z.infer<typeof subscribeSchema>['body'];

export class NewsletterSubscriberDTO {
    public readonly id: string;
    public readonly email: string;
    public readonly status: string;
    public readonly createdAt: Date;
    public readonly confirmedAt: Date | null;

    constructor(subscriber: NewsletterSubscriber) {
        this.id = subscriber.id;
        this.email = subscriber.email;
        this.status = subscriber.status;
        this.createdAt = subscriber.createdAt;
        this.confirmedAt = subscriber.confirmedAt;
    }
}
