import type { UserService } from '../../src/services/userService';
import type { AuthService } from '../../src/services/authService';
import type { StoryService } from '../../src/services/storyService';
import type { CategoryService } from '../../src/services/categoryService';

import { jest } from '@jest/globals';

export type UserServiceMock = jest.Mocked<UserService>;
export type AuthServiceMock = jest.Mocked<AuthService>;
export type StoryServiceMock = jest.Mocked<StoryService>;
export type CategoryServiceMock = jest.Mocked<CategoryService>;

export function createUserServiceMock(): UserServiceMock {
    return {
        getAllUsers: jest.fn(),
        getUserById: jest.fn(),
        getProfile: jest.fn(),
        checkByEmail: jest.fn(),
        checkByUsername: jest.fn(),
        getUserByEmail: jest.fn(),
        getUserByUsername: jest.fn(),
        updateProfile: jest.fn(),
        updateUser: jest.fn(),
        softDeleteUser: jest.fn(),
    } as unknown as UserServiceMock;
}

export function createStoryServiceMock(): StoryServiceMock {
    return {
        createStory: jest.fn(),
        getAllStories: jest.fn(),
        getStoryById: jest.fn(),
        regenerateSummary: jest.fn(),
        updateStory: jest.fn(),
        deleteStory: jest.fn(),
    } as unknown as StoryServiceMock;
}

export function createCategoryServiceMock(): CategoryServiceMock {
    return {
        createCategory: jest.fn(),
        getAllCategories: jest.fn(),
        getCategoryById: jest.fn(),
        updateCategory: jest.fn(),
        deleteCategory: jest.fn(),
    } as unknown as CategoryServiceMock;
}

export function createAuthServiceMock(): AuthServiceMock {
    return {
        signup: jest.fn(),
        login: jest.fn(),
        changePassword: jest.fn(),
        confirmPasswordChange: jest.fn(),
        confirmEmail: jest.fn(),
        resendVerification: jest.fn(),
    } as unknown as AuthServiceMock;
}
