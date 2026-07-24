import type { Request } from 'express';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { httpStatusCodes } from '../../../src/constants/statusCode';
import {
    buildUserQueryParams,
    buildUser,
    buildUpdateUserDTO,
    buildUpdateProfileDTO,
} from '../../utils/testHelpers';
import { createMockRes } from '../../utils/express.mock';

jest.mock('../../../src/services/userService', () => {
    const mockService = {
        getAllUsers: jest.fn(),
        getUserById: jest.fn(),
        getProfile: jest.fn(),
        updateProfile: jest.fn(),
        updateUser: jest.fn(),
        softDeleteUser: jest.fn(),
    };

    return {
        UserService: jest.fn().mockImplementation(() => mockService),
        __mockService: mockService,
    };
});

import { UserController } from '../../../src/controllers/userController';

const { __mockService: userServiceMock } = jest.requireMock(
    '../../../src/services/userService',
) as {
    __mockService: {
        getAllUsers: jest.Mock<any>;
        getUserById: jest.Mock<any>;
        getProfile: jest.Mock<any>;
        updateProfile: jest.Mock<any>;
        updateUser: jest.Mock<any>;
        softDeleteUser: jest.Mock<any>;
    };
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('UserController', () => {
    describe('getAllUsers', () => {
        it('returns 200 with the service payload', async () => {
            const query = buildUserQueryParams();
            const payload = {
                data: [buildUser(), buildUser()],
                meta: { offset: 0, limit: 10, total: 2 },
            };

            userServiceMock.getAllUsers.mockResolvedValue(payload);

            // NOTE: assumes getQuery(req) reads from req.validated.query.
            // If getQuery's implementation reads from a different property,
            // this test will pass `undefined` through instead of `query` --
            // check src/utils/request.ts if this test starts failing oddly.
            const req = { validated: { query } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await UserController.getAllUsers(req, res, next);

            expect(userServiceMock.getAllUsers).toHaveBeenCalledWith(query);
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: payload,
            });
        });
    });

    describe('getUserById', () => {
        it('returns 200 with the requested user', async () => {
            const user = buildUser();
            userServiceMock.getUserById.mockResolvedValue(user);

            const req = { params: { userId: user.id } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await UserController.getUserById(req, res, next);

            expect(userServiceMock.getUserById).toHaveBeenCalledWith(user.id);
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: user,
            });
        });

        it('forwards service errors to next', async () => {
            const error = new Error('not found');
            userServiceMock.getUserById.mockRejectedValue(error);

            const req = {
                params: { userId: 'missing-id' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await UserController.getUserById(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('getProfile', () => {
        it('returns 200 with the authenticated user profile', async () => {
            const user = buildUser({ id: 'me' });
            userServiceMock.getProfile.mockResolvedValue(user);

            const req = { user: { userId: 'me' } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await UserController.getProfile(req, res, next);

            expect(userServiceMock.getProfile).toHaveBeenCalledWith('me');
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: user,
            });
        });
    });

    describe('updateProfile', () => {
        it('updates the authenticated user profile and returns 200', async () => {
            const dto = buildUpdateProfileDTO({ name: 'New Name' });
            const updatedProfile = buildUser({ id: 'me', name: 'New Name' });
            userServiceMock.updateProfile.mockResolvedValue(updatedProfile);

            const req = {
                user: { userId: 'me' },
                body: dto,
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await UserController.updateProfile(req, res, next);

            expect(userServiceMock.updateProfile).toHaveBeenCalledWith(
                'me',
                dto,
            );
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: updatedProfile,
            });
        });

        it('forwards service errors to next', async () => {
            const error = new Error('email already in use');
            userServiceMock.updateProfile.mockRejectedValue(error);

            const req = {
                user: { userId: 'me' },
                body: buildUpdateProfileDTO(),
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await UserController.updateProfile(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('updateUser', () => {
        it('updates the targeted user and returns 200', async () => {
            const dto = buildUpdateUserDTO({ name: 'Updated' });
            const updatedUser = buildUser({ id: 'u-1', name: 'Updated' });
            userServiceMock.updateUser.mockResolvedValue(updatedUser);

            const req = {
                params: { userId: 'u-1' },
                body: dto,
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await UserController.updateUser(req, res, next);

            expect(userServiceMock.updateUser).toHaveBeenCalledWith('u-1', dto);
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: updatedUser,
            });
        });

        it('forwards service errors to next', async () => {
            const error = new Error('username already in use');
            userServiceMock.updateUser.mockRejectedValue(error);

            const req = {
                params: { userId: 'u-1' },
                body: buildUpdateUserDTO(),
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await UserController.updateUser(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('deleteUser', () => {
        it('soft-deletes the user and returns 200', async () => {
            userServiceMock.softDeleteUser.mockResolvedValue(
                buildUser({ id: 'u-1', isDeleted: true }),
            );

            const req = { params: { userId: 'u-1' } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await UserController.deleteUser(req, res, next);

            expect(userServiceMock.softDeleteUser).toHaveBeenCalledWith('u-1');
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            // NOTE: the controller calls sendResponse(res, OK, undefined) explicitly,
            // discarding the deleted-user payload the service returns.
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: undefined,
            });
        });

        it('forwards service errors to next and never calls res.json', async () => {
            const error = new Error('not found');
            userServiceMock.softDeleteUser.mockRejectedValue(error);

            const req = {
                params: { userId: 'missing-id' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await UserController.deleteUser(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.json).not.toHaveBeenCalled();
        });
    });
});
