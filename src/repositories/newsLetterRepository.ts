import { NewsletterSubscriber, PrismaClient } from '@prisma/client';

export class NewsletterRepository {
    constructor(private prisma: PrismaClient) {}

    async findByEmail(email: string): Promise<NewsletterSubscriber | null> {
        return this.prisma.newsletterSubscriber.findUnique({
            where: { email },
        });
    }

    async create(email: string): Promise<NewsletterSubscriber> {
        return this.prisma.newsletterSubscriber.create({
            data: { email, status: 'PENDING' },
        });
    }

    async markConfirmed(email: string): Promise<NewsletterSubscriber> {
        return this.prisma.newsletterSubscriber.update({
            where: { email },
            data: { status: 'CONFIRMED', confirmedAt: new Date() },
        });
    }

    async markUnsubscribed(email: string): Promise<NewsletterSubscriber> {
        return this.prisma.newsletterSubscriber.update({
            where: { email },
            data: { status: 'UNSUBSCRIBED', confirmedAt: null },
        });
    }

    async findAllConfirmedEmails(): Promise<string[]> {
        const subscribers = await this.prisma.newsletterSubscriber.findMany({
            where: { status: 'CONFIRMED' },
            select: { email: true },
        });
        return subscribers.map((s) => s.email);
    }

    async findAll(): Promise<NewsletterSubscriber[]> {
        return this.prisma.newsletterSubscriber.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async count(): Promise<number> {
        return this.prisma.newsletterSubscriber.count({
            where: { status: 'CONFIRMED' },
        });
    }
}
