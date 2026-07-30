import type { Request } from 'express';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { httpStatusCodes } from '../../../src/constants/statusCode';
import { createMockRes } from '../../utils/express.mock';

jest.mock('../../../src/services/authService', () => {
    const mockService = {
        signup: jest.fn(),
        login: jest.fn(),
        confirmEmail: jest.fn(),
        resendVerification: jest.fn(),
        changePassword: jest.fn(),
        confirmPasswordChange: jest.fn(),
    };

    return {
        AuthService: jest.fn().mockImplementation(() => mockService),
        __mockService: mockService,
    };
});

jest.mock('../../../src/config/env', () => ({
    env: {
        NODE_ENV: 'test',
        JWT_EXPIRATION: '10d',
    },
}));

jest.mock('ms', () => jest.fn(() => 864000000));

import { AuthController } from '../../../src/controllers/authController';

const { __mockService: authServiceMock } = jest.requireMock(
    '../../../src/services/authService',
) as {
    __mockService: {
        signup: jest.Mock<any>;
        login: jest.Mock<any>;
        confirmEmail: jest.Mock<any>;
        resendVerification: jest.Mock<any>;
        changePassword: jest.Mock<any>;
        confirmPasswordChange: jest.Mock<any>;
    };
};

const expectedCookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 864000000,
} as const;

beforeEach(() => {
    jest.clearAllMocks();
});

describe('AuthController', () => {
    describe('signup', () => {
        it('sets an auth cookie and returns 201 with the user payload', async () => {
            const payload = {
                token: 'signed-jwt',
                user: { id: 'u-1', username: 'tester' },
            };
            authServiceMock.signup.mockResolvedValue(payload);

            const req = { body: { username: 'tester' } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await AuthController.signup(req, res, next);

            expect(authServiceMock.signup).toHaveBeenCalledWith(req.body);
            expect(res.cookie).toHaveBeenCalledWith(
                'token',
                'signed-jwt',
                expectedCookieOptions,
            );
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.CREATED);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: {
                    token: 'signed-jwt',
                    user: payload.user,
                },
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('forwards service errors to next and never sets a cookie', async () => {
            const error = new Error('email already in use');
            authServiceMock.signup.mockRejectedValue(error);

            const req = { body: { username: 'tester' } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await AuthController.signup(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.cookie).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('sets an auth cookie and returns 200 with the user payload', async () => {
            const payload = {
                token: 'signed-jwt',
                user: { id: 'u-1', username: 'tester' },
            };
            authServiceMock.login.mockResolvedValue(payload);

            const req = {
                body: { email: 'test@example.com', password: 'secret' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await AuthController.login(req, res, next);

            expect(authServiceMock.login).toHaveBeenCalledWith(req.body);
            expect(res.cookie).toHaveBeenCalledWith(
                'token',
                'signed-jwt',
                expectedCookieOptions,
            );
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: {
                    token: 'signed-jwt',
                    user: payload.user,
                },
            });
        });

        it('forwards invalid-credential errors to next and never sets a cookie', async () => {
            const error = new Error('invalid credentials');
            authServiceMock.login.mockRejectedValue(error);

            const req = {
                body: { email: 'test@example.com', password: 'wrong' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await AuthController.login(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.cookie).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('confirmEmail', () => {
        it('confirms the email and returns 200 with the result', async () => {
            const payload = { message: 'verified' };
            authServiceMock.confirmEmail.mockResolvedValue(payload);

            const req = { params: { token: 'token-1' } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await AuthController.confirmEmail(req, res, next);

            expect(authServiceMock.confirmEmail).toHaveBeenCalledWith(
                'token-1',
            );
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: payload,
            });
        });

        it('forwards service errors to next', async () => {
            const error = new Error('boom');
            authServiceMock.confirmEmail.mockRejectedValue(error);

            const req = { params: { token: 'token-1' } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await AuthController.confirmEmail(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('resendVerification', () => {
        it('resends the verification email and returns 200', async () => {
            authServiceMock.resendVerification.mockResolvedValue({
                message: 'sent',
            });

            const req = {
                body: { email: 'test@example.com' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await AuthController.resendVerification(req, res, next);

            expect(authServiceMock.resendVerification).toHaveBeenCalledWith(
                'test@example.com',
            );
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalled();
        });

        it('forwards service errors to next', async () => {
            const error = new Error('already verified');
            authServiceMock.resendVerification.mockRejectedValue(error);

            const req = {
                body: { email: 'test@example.com' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await AuthController.resendVerification(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('changePassword', () => {
        it('changes the password and returns 200 with the result', async () => {
            authServiceMock.changePassword.mockResolvedValue(
                'Password change email sent',
            );

            const req = {
                body: { oldPassword: 'old', newPassword: 'new' },
                user: { userId: 'u-1' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await AuthController.changePassword(req, res, next);

            expect(authServiceMock.changePassword).toHaveBeenCalledWith(
                'u-1',
                req.body,
            );
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: 'Password change email sent',
            });
        });

        it('forwards service errors to next', async () => {
            const error = new Error('invalid credentials');
            authServiceMock.changePassword.mockRejectedValue(error);

            const req = {
                body: { oldPassword: 'wrong', newPassword: 'new' },
                user: { userId: 'u-1' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await AuthController.changePassword(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('confirmPasswordChange', () => {
        it('confirms the password change and returns 200 with the result', async () => {
            authServiceMock.confirmPasswordChange.mockResolvedValue(
                'Password changed',
            );

            const req = {
                body: { token: 'change-token', newPassword: 'new-password' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await AuthController.confirmPasswordChange(req, res, next);

            expect(authServiceMock.confirmPasswordChange).toHaveBeenCalledWith(
                req.body,
            );
            expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: 'Password changed',
            });
        });

        it('forwards service errors to next', async () => {
            const error = new Error('invalid token');
            authServiceMock.confirmPasswordChange.mockRejectedValue(error);

            const req = {
                body: { token: 'bad-token', newPassword: 'new-password' },
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn();

            await AuthController.confirmPasswordChange(req, res, next);
            await new Promise((resolve) => setImmediate(resolve));

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
        });
    });
});
