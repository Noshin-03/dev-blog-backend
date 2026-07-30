import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import {
    ConflictError,
    NotFoundError,
    UnauthorizedError,
    ValidationError,
} from '../../../src/common/errorsClass';
import { Messages } from '../../../src/constants/messages';
import type {
    AuthRepositoryMock,
    AccountRepositoryMock,
} from '../../mocks/repositories.mock';
import {
    createAuthRepositoryMock,
    createAccountRepositoryMock,
} from '../../mocks/repositories.mock';
import type { UserServiceMock } from '../../mocks/services.mock';
import { createUserServiceMock } from '../../mocks/services.mock';

const mockAuthRepo: AuthRepositoryMock = createAuthRepositoryMock();
const mockAccountRepo: AccountRepositoryMock = createAccountRepositoryMock();
const mockUserService: UserServiceMock = createUserServiceMock();

const signEmailTokenMock = jest.fn();
const signTokenMock = jest.fn();
const verifyEmailTokenMock = jest.fn();
const verifyPasswordChangeTokenMock = jest.fn();
const signPasswordChangeTokenMock = jest.fn();
const sendVerificationEmailMock = jest.fn();
const sendPasswordChangeEmailMock = jest.fn();
const sendPasswordChangedNotificationMock = jest.fn();
const consumeTokenMock = jest.fn();
const bcryptHashMock =
    jest.fn<(data: string, saltRounds: number) => Promise<string>>();
const bcryptCompareMock =
    jest.fn<(data: string, encrypted: string) => Promise<boolean>>();

jest.mock('../../../src/config/prisma', () => ({
    __esModule: true,
    default: {},
}));

jest.mock('../../../src/repositories/authRepository', () => ({
    AuthRepository: jest.fn(() => mockAuthRepo),
}));

jest.mock('../../../src/repositories/accountRepository', () => ({
    AccountRepository: jest.fn(() => mockAccountRepo),
}));

jest.mock('../../../src/services/userService', () => ({
    UserService: jest.fn(() => mockUserService),
}));

jest.mock('../../../src/utils/jwt', () => ({
    signPasswordChangeToken: signPasswordChangeTokenMock,
    verifyPasswordChangeToken: verifyPasswordChangeTokenMock,
    signToken: signTokenMock,
    signEmailToken: signEmailTokenMock,
    verifyEmailToken: verifyEmailTokenMock,
}));

jest.mock('../../../src/utils/mailer', () => ({
    sendVerificationEmail: sendVerificationEmailMock,
    sendPasswordChangeEmail: sendPasswordChangeEmailMock,
    sendPasswordChangedNotification: sendPasswordChangedNotificationMock,
}));

jest.mock('../../../src/utils/rateLimiter', () => ({
    consumeToken: consumeTokenMock,
}));

jest.mock('bcrypt', () => ({
    hash: bcryptHashMock,
    compare: bcryptCompareMock,
}));

describe('AuthService', () => {
    let authService: any;

    beforeEach(async () => {
        jest.clearAllMocks();
        const { AuthService } =
            await import('../../../src/services/authService');
        authService = new AuthService();
    });

    describe('signup', () => {
        it('creates a user account and sends a verification email', async () => {
            mockUserService.checkByEmail.mockResolvedValue(null as any);
            mockUserService.checkByUsername.mockResolvedValue(null as any);
            bcryptHashMock.mockResolvedValue('hashed-password');
            mockAccountRepo.createUserWithAuth.mockResolvedValue({
                id: 'u-1',
                username: 'tester',
                name: 'Tester',
                email: 'test@example.com',
                role: 'USER',
            } as any);
            signEmailTokenMock.mockReturnValue('email-token');
            signTokenMock.mockReturnValue('jwt-token');

            const result = await authService.signup({
                email: 'test@example.com',
                username: 'tester',
                name: 'Tester',
                password: 'password123',
            } as any);

            expect(mockUserService.checkByEmail).toHaveBeenCalledWith(
                'test@example.com',
            );
            expect(mockUserService.checkByUsername).toHaveBeenCalledWith(
                'tester',
            );
            expect(bcryptHashMock).toHaveBeenCalledWith('password123', 10);
            expect(mockAccountRepo.createUserWithAuth).toHaveBeenCalledWith({
                username: 'tester',
                name: 'Tester',
                email: 'test@example.com',
                passwordHash: 'hashed-password',
            });
            expect(signEmailTokenMock).toHaveBeenCalledWith('u-1');
            expect(sendVerificationEmailMock).toHaveBeenCalledWith(
                'test@example.com',
                'email-token',
            );
            expect(result).toEqual({
                token: 'jwt-token',
                user: {
                    id: 'u-1',
                    username: 'tester',
                    name: 'Tester',
                    email: 'test@example.com',
                },
            });
        });

        it('throws ConflictError when the email already exists', async () => {
            mockUserService.checkByEmail.mockResolvedValue({
                id: 'u-1',
            } as any);

            await expect(
                authService.signup({ email: 'test@example.com' } as any),
            ).rejects.toThrow(Messages.EMAIL_ALREADY_IN_USE);
            await expect(
                authService.signup({ email: 'test@example.com' } as any),
            ).rejects.toBeInstanceOf(ConflictError);
            expect(mockAccountRepo.createUserWithAuth).not.toHaveBeenCalled();
        });

        it('throws ConflictError when the username already exists', async () => {
            mockUserService.checkByEmail.mockResolvedValue(null as any);
            mockUserService.checkByUsername.mockResolvedValue({
                id: 'u-1',
            } as any);

            await expect(
                authService.signup({
                    email: 'new@example.com',
                    username: 'taken',
                } as any),
            ).rejects.toThrow(Messages.USERNAME_ALREADY_IN_USE);
            await expect(
                authService.signup({
                    email: 'new@example.com',
                    username: 'taken',
                } as any),
            ).rejects.toBeInstanceOf(ConflictError);
            expect(mockAccountRepo.createUserWithAuth).not.toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('throws UnauthorizedError when the user has no auth record', async () => {
            mockUserService.getUserByEmail.mockResolvedValue({
                id: 'u-1',
            } as any);
            mockAuthRepo.checkAuthByUserId.mockResolvedValue(null as any);

            await expect(
                authService.login({
                    email: 'test@example.com',
                    password: 'secret',
                } as any),
            ).rejects.toThrow(Messages.INVALID_CREDENTIALS);
            await expect(
                authService.login({
                    email: 'test@example.com',
                    password: 'secret',
                } as any),
            ).rejects.toBeInstanceOf(UnauthorizedError);
        });

        it('throws UnauthorizedError when the password does not match', async () => {
            mockUserService.getUserByEmail.mockResolvedValue({
                id: 'u-1',
                isVerified: true,
            } as any);
            mockAuthRepo.checkAuthByUserId.mockResolvedValue({
                password: 'hashed',
            } as any);
            bcryptCompareMock.mockResolvedValue(false);

            await expect(
                authService.login({
                    email: 'test@example.com',
                    password: 'wrong',
                } as any),
            ).rejects.toThrow(Messages.INVALID_CREDENTIALS);
            await expect(
                authService.login({
                    email: 'test@example.com',
                    password: 'wrong',
                } as any),
            ).rejects.toBeInstanceOf(UnauthorizedError);
        });

        it('sends a verification email and throws when the user is unverified', async () => {
            mockUserService.getUserByEmail.mockResolvedValue({
                id: 'u-1',
                email: 'test@example.com',
                isVerified: false,
            } as any);
            mockAuthRepo.checkAuthByUserId.mockResolvedValue({
                password: 'hashed',
            } as any);
            bcryptCompareMock.mockResolvedValue(true);
            signEmailTokenMock.mockReturnValue('email-token');

            await expect(
                authService.login({
                    email: 'test@example.com',
                    password: 'secret',
                } as any),
            ).rejects.toThrow(Messages.EMAIL_NOT_VERIFIED);
            expect(sendVerificationEmailMock).toHaveBeenCalledWith(
                'test@example.com',
                'email-token',
            );
        });

        it('returns a token and user payload on success', async () => {
            mockUserService.getUserByEmail.mockResolvedValue({
                id: 'u-1',
                username: 'tester',
                name: 'Tester',
                email: 'test@example.com',
                role: 'USER',
                isVerified: true,
            } as any);
            mockAuthRepo.checkAuthByUserId.mockResolvedValue({
                password: 'hashed',
            } as any);
            bcryptCompareMock.mockResolvedValue(true);
            signTokenMock.mockReturnValue('jwt-token');

            const result = await authService.login({
                email: 'test@example.com',
                password: 'secret',
            } as any);

            expect(signTokenMock).toHaveBeenCalledWith({
                userId: 'u-1',
                username: 'tester',
                email: 'test@example.com',
                role: 'USER',
            });
            expect(result).toEqual({
                token: 'jwt-token',
                user: {
                    id: 'u-1',
                    username: 'tester',
                    name: 'Tester',
                    email: 'test@example.com',
                },
            });
        });
    });

    describe('changePassword', () => {
        it('throws UnauthorizedError when there is no auth record', async () => {
            mockAuthRepo.checkAuthByUserId.mockResolvedValue(null as any);

            await expect(
                authService.changePassword('u-1', {
                    oldPassword: 'old',
                    newPassword: 'new',
                } as any),
            ).rejects.toThrow(Messages.INVALID_CREDENTIALS);
            await expect(
                authService.changePassword('u-1', {
                    oldPassword: 'old',
                    newPassword: 'new',
                } as any),
            ).rejects.toBeInstanceOf(UnauthorizedError);
        });

        it('throws UnauthorizedError when the old password does not match', async () => {
            mockAuthRepo.checkAuthByUserId.mockResolvedValue({
                password: 'hashed',
                user: { email: 'a@b.com' },
            } as any);
            bcryptCompareMock.mockResolvedValue(false);

            await expect(
                authService.changePassword('u-1', {
                    oldPassword: 'wrong',
                    newPassword: 'new',
                } as any),
            ).rejects.toThrow(Messages.INVALID_CREDENTIALS);
            expect(mockAuthRepo.savePasswordChangeToken).not.toHaveBeenCalled();
        });

        it('sends a password-change email and returns the confirmation message on success', async () => {
            mockAuthRepo.checkAuthByUserId.mockResolvedValue({
                password: 'hashed',
                user: { email: 'a@b.com' },
            } as any);
            bcryptCompareMock.mockResolvedValue(true);
            signPasswordChangeTokenMock.mockReturnValue('change-token');

            const result = await authService.changePassword('u-1', {
                oldPassword: 'old',
                newPassword: 'new',
            } as any);

            expect(signPasswordChangeTokenMock).toHaveBeenCalledWith('u-1');
            expect(mockAuthRepo.savePasswordChangeToken).toHaveBeenCalledWith(
                'u-1',
                'change-token',
            );
            expect(sendPasswordChangeEmailMock).toHaveBeenCalledWith(
                'a@b.com',
                'change-token',
            );
            expect(result).toBe(Messages.PASSWORD_CHANGE_EMAIL_SENT);
        });
    });

    describe('confirmPasswordChange', () => {
        const basePayload = { userId: 'u-1', purpose: 'password-change' };

        it('throws UnauthorizedError when the token record does not exist', async () => {
            mockAuthRepo.checkByToken.mockResolvedValue(null as any);

            await expect(
                authService.confirmPasswordChange({ token: 't' } as any),
            ).rejects.toThrow(Messages.INVALID_TOKEN);
            await expect(
                authService.confirmPasswordChange({ token: 't' } as any),
            ).rejects.toBeInstanceOf(UnauthorizedError);
        });

        it('throws UnauthorizedError when the token record is invalid', async () => {
            mockAuthRepo.checkByToken.mockResolvedValue({
                isValid: false,
            } as any);

            await expect(
                authService.confirmPasswordChange({ token: 't' } as any),
            ).rejects.toThrow(Messages.INVALID_TOKEN);
        });

        it('throws ValidationError when the token purpose does not match', async () => {
            mockAuthRepo.checkByToken.mockResolvedValue({
                isValid: true,
            } as any);
            verifyPasswordChangeTokenMock.mockReturnValue({
                userId: 'u-1',
                purpose: 'something-else',
            });

            await expect(
                authService.confirmPasswordChange({
                    token: 't',
                    newPassword: 'new',
                } as any),
            ).rejects.toThrow(Messages.INVALID_TOKEN);
            await expect(
                authService.confirmPasswordChange({
                    token: 't',
                    newPassword: 'new',
                } as any),
            ).rejects.toBeInstanceOf(ValidationError);
        });

        it('throws UnauthorizedError when there is no auth record for the token user', async () => {
            mockAuthRepo.checkByToken.mockResolvedValue({
                isValid: true,
            } as any);
            verifyPasswordChangeTokenMock.mockReturnValue(basePayload);
            mockAuthRepo.checkAuthByUserId.mockResolvedValue(null as any);

            await expect(
                authService.confirmPasswordChange({
                    token: 't',
                    newPassword: 'new',
                } as any),
            ).rejects.toThrow(Messages.INVALID_CREDENTIALS);
        });

        it('throws ValidationError when the new password matches the old one', async () => {
            mockAuthRepo.checkByToken.mockResolvedValue({
                isValid: true,
            } as any);
            verifyPasswordChangeTokenMock.mockReturnValue(basePayload);
            mockAuthRepo.checkAuthByUserId.mockResolvedValue({
                password: 'hashed',
                user: { email: 'a@b.com' },
            } as any);
            bcryptCompareMock.mockResolvedValue(true);

            await expect(
                authService.confirmPasswordChange({
                    token: 't',
                    newPassword: 'same',
                } as any),
            ).rejects.toThrow(Messages.PASSWORD_INVALID);
            await expect(
                authService.confirmPasswordChange({
                    token: 't',
                    newPassword: 'same',
                } as any),
            ).rejects.toBeInstanceOf(ValidationError);
            expect(mockAuthRepo.changePassword).not.toHaveBeenCalled();
        });

        it('changes the password, invalidates the token, and notifies the user on success', async () => {
            mockAuthRepo.checkByToken.mockResolvedValue({
                isValid: true,
            } as any);
            verifyPasswordChangeTokenMock.mockReturnValue(basePayload);
            mockAuthRepo.checkAuthByUserId.mockResolvedValue({
                password: 'hashed',
                user: { email: 'a@b.com' },
            } as any);
            bcryptCompareMock.mockResolvedValue(false);
            bcryptHashMock.mockResolvedValue('new-hashed');

            const result = await authService.confirmPasswordChange({
                token: 't',
                newPassword: 'new-password',
            } as any);

            expect(bcryptHashMock).toHaveBeenCalledWith('new-password', 10);
            expect(mockAuthRepo.changePassword).toHaveBeenCalledWith(
                'u-1',
                'new-hashed',
            );
            expect(
                mockAuthRepo.invalidatePasswordChangeToken,
            ).toHaveBeenCalledWith('u-1');
            expect(sendPasswordChangedNotificationMock).toHaveBeenCalledWith(
                'a@b.com',
            );
            expect(result).toBe(Messages.CHANGED);
        });
    });

    describe('confirmEmail', () => {
        it('verifies email and marks the user as verified', async () => {
            verifyEmailTokenMock.mockReturnValue({
                userId: 'u-1',
                purpose: 'email-verification',
            });
            mockUserService.getUserById.mockResolvedValue({
                id: 'u-1',
                isVerified: false,
            } as any);

            const result = await authService.confirmEmail('token');

            expect(mockAuthRepo.markEmailVerified).toHaveBeenCalledWith('u-1');
            expect(result).toEqual({ message: Messages.EMAIL_VERIFIED });
        });

        it('does not re-mark verification when the user is already verified', async () => {
            verifyEmailTokenMock.mockReturnValue({
                userId: 'u-1',
                purpose: 'email-verification',
            });
            mockUserService.getUserById.mockResolvedValue({
                id: 'u-1',
                isVerified: true,
            } as any);

            const result = await authService.confirmEmail('token');

            expect(mockAuthRepo.markEmailVerified).not.toHaveBeenCalled();
            expect(result).toEqual({ message: Messages.EMAIL_VERIFIED });
        });

        it(
            'throws NotFoundError if the user lookup resolves to null ' +
                '(unreachable via the real userService, which throws first -- ' +
                'exercised here only by mocking userService directly)',
            async () => {
                verifyEmailTokenMock.mockReturnValue({
                    userId: 'u-1',
                    purpose: 'email-verification',
                });
                mockUserService.getUserById.mockResolvedValue(null as any);

                await expect(authService.confirmEmail('token')).rejects.toThrow(
                    Messages.USER_NOT_FOUND,
                );
                await expect(
                    authService.confirmEmail('token'),
                ).rejects.toBeInstanceOf(NotFoundError);
                expect(mockAuthRepo.markEmailVerified).not.toHaveBeenCalled();
            },
        );

        it('throws ValidationError for an invalid email token', async () => {
            verifyEmailTokenMock.mockImplementation(() => {
                throw new Error('bad token');
            });

            await expect(authService.confirmEmail('bad')).rejects.toThrow(
                Messages.INVALID_VERIFICATION_LINK,
            );
            await expect(
                authService.confirmEmail('bad'),
            ).rejects.toBeInstanceOf(ValidationError);
        });

        it('throws a link-expired ValidationError when the token has expired', async () => {
            const expiredError = new Error('expired');
            expiredError.name = 'TokenExpiredError';
            verifyEmailTokenMock.mockImplementation(() => {
                throw expiredError;
            });

            await expect(
                authService.confirmEmail('expired-token'),
            ).rejects.toThrow(Messages.VERIFICATION_LINK_EXPIRED);
            await expect(
                authService.confirmEmail('expired-token'),
            ).rejects.toBeInstanceOf(ValidationError);
        });

        it('throws ValidationError when the token purpose does not match', async () => {
            verifyEmailTokenMock.mockReturnValue({
                userId: 'u-1',
                purpose: 'something-else',
            });

            await expect(authService.confirmEmail('token')).rejects.toThrow(
                Messages.INVALID_VERIFICATION_LINK,
            );
            await expect(
                authService.confirmEmail('token'),
            ).rejects.toBeInstanceOf(ValidationError);
        });
    });

    describe('resendVerification', () => {
        it('resends verification email when the user is unverified', async () => {
            mockUserService.getUserByEmail.mockResolvedValue({
                id: 'u-1',
                email: 'test@example.com',
                isVerified: false,
            } as any);
            consumeTokenMock.mockReturnValue(true);
            signEmailTokenMock.mockReturnValue('email-token');

            const result =
                await authService.resendVerification('test@example.com');

            expect(sendVerificationEmailMock).toHaveBeenCalledWith(
                'test@example.com',
                'email-token',
            );
            expect(result).toEqual({
                message: Messages.VERIFICATION_EMAIL_SENT,
            });
        });

        it(
            'throws UnauthorizedError if the user lookup resolves to null ' +
                '(unreachable via the real userService, which throws first -- ' +
                'exercised here only by mocking userService directly)',
            async () => {
                mockUserService.getUserByEmail.mockResolvedValue(null as any);

                await expect(
                    authService.resendVerification('missing@example.com'),
                ).rejects.toThrow(Messages.USER_NOT_FOUND);
                await expect(
                    authService.resendVerification('missing@example.com'),
                ).rejects.toBeInstanceOf(UnauthorizedError);
                expect(sendVerificationEmailMock).not.toHaveBeenCalled();
            },
        );

        it('throws ValidationError when the user is already verified', async () => {
            mockUserService.getUserByEmail.mockResolvedValue({
                id: 'u-1',
                email: 'test@example.com',
                isVerified: true,
            } as any);

            await expect(
                authService.resendVerification('test@example.com'),
            ).rejects.toThrow(Messages.EMAIL_ALREADY_VERIFIED);
            await expect(
                authService.resendVerification('test@example.com'),
            ).rejects.toBeInstanceOf(ValidationError);
            expect(sendVerificationEmailMock).not.toHaveBeenCalled();
        });

        it('throws ValidationError when the resend is rate-limited', async () => {
            mockUserService.getUserByEmail.mockResolvedValue({
                id: 'u-1',
                email: 'test@example.com',
                isVerified: false,
            } as any);
            consumeTokenMock.mockReturnValue(false);

            await expect(
                authService.resendVerification('test@example.com'),
            ).rejects.toThrow(Messages.TOO_MANY_REQUESTS);
            await expect(
                authService.resendVerification('test@example.com'),
            ).rejects.toBeInstanceOf(ValidationError);
            expect(sendVerificationEmailMock).not.toHaveBeenCalled();
        });
    });
});
