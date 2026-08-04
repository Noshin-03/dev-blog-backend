import { User } from '@prisma/client';
import { z } from 'zod';
import { updateUserSchema } from '../schemas/userSchema';
import { StoryCategory, Category } from '@prisma/client';

export type UpdateProfileDTO = z.infer<typeof updateUserSchema>['body'];

type UserWithRelations = User & {
    stories?: { storyId: string; title: string }[] | null;
    categories?: (StoryCategory & { category: Category })[];
};

export class ProfileResponseDTO {
    public readonly id: string;
    public readonly username: string;
    public readonly name: string;
    public readonly email: string;
    public readonly role: string;
    public readonly joinDate: Date;
    public readonly avatar: string | null;

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
        this.joinDate = user.joinDate;
        this.avatar = user.avatarUrl;
    }
}

export class OthersProfileDTO {
    public readonly username: string;
    public readonly name: string;
    public readonly email: string;
    public readonly stories?: {
        storyId: string;
        title: string;
    }[];

    constructor(user: UserWithRelations) {
        this.username = user.username;
        this.name = user.name;
        this.email = user.email;

        if (user.stories) {
            this.stories = user.stories.map((s) => ({
                storyId: s.storyId,
                title: s.title,
            }));
        }
    }
}
