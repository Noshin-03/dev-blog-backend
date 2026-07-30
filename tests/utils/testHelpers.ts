import { Role, type User } from '@prisma/client';
import type { UpdateUserDTO } from '../../src/dtos/userDTO.js';
import type { UpdateProfileDTO } from '../../src/dtos/profileDTO.js';
import type { UserQueryParams } from '../../src/schemas/querySchema.js';

let counter = 0;
const nextId = () => `user-${++counter}`;
const nextUsername = () => `user_${counter}`;
const nextEmail = () => `user${counter}@example.com`;
const nextName = () => `User Number ${counter}`;

export function buildUser(overrides: Partial<User> = {}): User {
    return {
        id: nextId(),
        username: nextUsername(),
        name: nextName(),
        email: nextEmail(),
        joinDate: new Date('2026-01-01T00:00:00.000Z'),
        role: Role.USER,
        isDeleted: false,
        isVerified: false,
        avatarUrl: null,
        ...overrides,
    };
}

export function buildUserList(count = 3): User[] {
    return Array.from({ length: count }, (_, index) =>
        buildUser({
            username: `user_${index}`,
            email: `user${index}@example.com`,
        }),
    );
}

export function buildUpdateUserDTO(
    overrides: Partial<UpdateUserDTO> = {},
): UpdateUserDTO {
    return {
        username: nextUsername(),
        name: nextName(),
        email: nextEmail(),
        ...overrides,
    } as UpdateUserDTO;
}

export function buildUpdateProfileDTO(
    overrides: Partial<UpdateProfileDTO> = {},
): UpdateProfileDTO {
    return {
        name: nextName(),
        ...overrides,
    } as UpdateProfileDTO;
}

export function buildUserQueryParams(
    overrides: Partial<UserQueryParams> = {},
): UserQueryParams {
    return {
        page: 1,
        itemsPerPage: 10,
        orderBy: 'joinDate',
        ...overrides,
    } as UserQueryParams;
}
