import type { UserRepository } from '../../src/repositories/userRepository';
import type { AccountRepository } from '../../src/repositories/accountRepository';
import type { StoryRepository } from '../../src/repositories/storyRepository';
import type { CategoryRepository } from '../../src/repositories/categoryRepository';
import type { AuthRepository } from '../../src/repositories/authRepository';

import { jest } from '@jest/globals';

export type UserRepositoryMock = jest.Mocked<UserRepository>;
export type AccountRepositoryMock = jest.Mocked<AccountRepository>;
export type StoryRepositoryMock = jest.Mocked<StoryRepository>;
export type CategoryRepositoryMock = jest.Mocked<CategoryRepository>;
export type AuthRepositoryMock = jest.Mocked<AuthRepository>;

export function createUserRepositoryMock(): UserRepositoryMock {
    return {
        getAllUser: jest.fn(),
        getUserById: jest.fn(),
        getUserByEmail: jest.fn(),
        getUserByUsername: jest.fn(),
        checkByUsername: jest.fn(),
        checkByEmail: jest.fn(),
        checkById: jest.fn(),
        update: jest.fn(),
    } as unknown as UserRepositoryMock;
}

export function createAccountRepositoryMock(): AccountRepositoryMock {
    return {
        createUserWithAuth: jest.fn(),
        softDeleteUserWithAuth: jest.fn(),
    } as unknown as AccountRepositoryMock;
}

export function createStoryRepositoryMock(): StoryRepositoryMock {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        getById: jest.fn(),
        checkById: jest.fn(),
        storeSummary: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    } as unknown as StoryRepositoryMock;
}

export function createCategoryRepositoryMock(): CategoryRepositoryMock {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        findByName: jest.fn(),
        checkById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    } as unknown as CategoryRepositoryMock;
}

export function createAuthRepositoryMock(): AuthRepositoryMock {
    return {
        changePassword: jest.fn(),
        checkAuthByUserId: jest.fn(),
        checkByToken: jest.fn(),
        savePasswordChangeToken: jest.fn(),
        invalidatePasswordChangeToken: jest.fn(),
        markEmailVerified: jest.fn(),
    } as unknown as AuthRepositoryMock;
}
