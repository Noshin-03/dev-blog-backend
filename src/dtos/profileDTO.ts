import { User } from '@prisma/client';
import { z } from 'zod';
import { updateUserSchema } from '../schemas/userSchema';

export type UpdateProfileDTO = z.infer<typeof updateUserSchema>['body'];

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
