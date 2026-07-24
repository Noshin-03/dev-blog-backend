import { z } from 'zod';
import { Role, User } from '@prisma/client';
import { createUserSchema, updateUserSchema } from '../schemas/userSchema';

export type CreateUserDTO = z.infer<typeof createUserSchema>['body'];
export type UpdateUserDTO = z.infer<typeof updateUserSchema>['body'];

export class UserResponseDTO {
    public readonly id: string;
    public readonly username: string;
    public readonly name: string;
    public readonly email: string;
    public readonly joinDate: Date;
    public readonly role: Role;
    public readonly isVerified: boolean;

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.name = user.name;
        this.email = user.email;
        this.joinDate = user.joinDate;
        this.role = user.role;
        this.isVerified = user.isVerified;
    }
}
