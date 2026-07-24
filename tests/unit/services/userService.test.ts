import { jest, describe, it, beforeEach, expect } from '@jest/globals';

import { NotFoundError, ConflictError } from '../../../src/common/errorsClass';
import { Messages } from '../../../src/constants/messages';
import { UserResponseDTO } from '../../../src/dtos/userDTO';
import { ProfileResponseDTO } from '../../../src/dtos/profileDTO';
import {
    buildUser,
    buildUserQueryParams,
    buildUpdateUserDTO,
    buildUpdateProfileDTO,
} from '../../utils/testHelpers';
import type {
    UserRepositoryMock,
    AccountRepositoryMock,
} from '../../mocks/repositories.mock';
import {
    createUserRepositoryMock,
    createAccountRepositoryMock,
} from '../../mocks/repositories.mock';

const mockUserRepo: UserRepositoryMock = createUserRepositoryMock();
const mockAccountRepo: AccountRepositoryMock = createAccountRepositoryMock();

const signEmailTokenMock = jest.fn();
const sendVerificationEmailMock = jest.fn();

jest.mock('../../../src/config/prisma', () => ({
    default: {},
}));

jest.mock('../../../src/repositories/userRepository', () => ({
    UserRepository: jest.fn(() => mockUserRepo),
}));

jest.mock('../../../src/repositories/accountRepository', () => ({
    AccountRepository: jest.fn(() => mockAccountRepo),
}));

jest.mock('../../../src/utils/jwt', () => ({
    signEmailToken: signEmailTokenMock,
}));

jest.mock('../../../src/utils/mailer', () => ({
    sendVerificationEmail: sendVerificationEmailMock,
}));

describe('UserService', () => {
    let userService: any;

    beforeEach(async () => {
        jest.clearAllMocks();

        const { UserService } =
            await import('../../../src/services/userService');

        userService = new UserService();
    });

    describe('getAllUsers', () => {
        it('maps repository results to UserResponseDTO[]', async () => {
            const users = [buildUser(), buildUser()];

            mockUserRepo.getAllUser.mockResolvedValue(users);

            const params = buildUserQueryParams();

            const result = await userService.getAllUsers(params);

            expect(mockUserRepo.getAllUser).toHaveBeenCalledWith(params);
            expect(result).toEqual(users.map((u) => new UserResponseDTO(u)));
        });

        it('returns an empty array when there are no users', async () => {
            mockUserRepo.getAllUser.mockResolvedValue([]);

            const result = await userService.getAllUsers(
                buildUserQueryParams(),
            );

            expect(result).toEqual([]);
        });
    });

    describe('getUserById', () => {
        it('returns a UserResponseDTO when the user exists', async () => {
            const user = buildUser();
            mockUserRepo.getUserById.mockResolvedValue(user);

            const result = await userService.getUserById(user.id);

            expect(mockUserRepo.getUserById).toHaveBeenCalledWith(user.id);
            expect(result).toEqual(new UserResponseDTO(user));
        });

        it('throws NotFoundError when the user does not exist', async () => {
            mockUserRepo.getUserById.mockResolvedValue(null);

            await expect(userService.getUserById('missing-id')).rejects.toThrow(
                NotFoundError,
            );
            await expect(userService.getUserById('missing-id')).rejects.toThrow(
                Messages.USER_NOT_FOUND,
            );
        });
    });

    describe('getUserByEmail', () => {
        it('returns a UserResponseDTO when found', async () => {
            const user = buildUser();
            mockUserRepo.getUserByEmail.mockResolvedValue(user);

            const result = await userService.getUserByEmail(user.email);

            expect(mockUserRepo.getUserByEmail).toHaveBeenCalledWith(
                user.email,
            );
            expect(result).toEqual(new UserResponseDTO(user));
        });

        it('throws NotFoundError when not found', async () => {
            mockUserRepo.getUserByEmail.mockResolvedValue(null);

            await expect(
                userService.getUserByEmail('nope@example.com'),
            ).rejects.toThrow(NotFoundError);
        });
    });

    describe('getUserByUsername', () => {
        it('returns a UserResponseDTO when found', async () => {
            const user = buildUser();
            mockUserRepo.getUserByUsername.mockResolvedValue(user);

            const result = await userService.getUserByUsername(user.username);

            expect(mockUserRepo.getUserByUsername).toHaveBeenCalledWith(
                user.username,
            );
            expect(result).toEqual(new UserResponseDTO(user));
        });

        it('throws NotFoundError when not found', async () => {
            mockUserRepo.getUserByUsername.mockResolvedValue(null);

            await expect(userService.getUserByUsername('nope')).rejects.toThrow(
                NotFoundError,
            );
        });
    });

    describe('getProfile', () => {
        it('returns a ProfileResponseDTO when the user exists', async () => {
            const user = buildUser();
            mockUserRepo.getUserById.mockResolvedValue(user);

            const result = await userService.getProfile(user.id);

            expect(mockUserRepo.getUserById).toHaveBeenCalledWith(user.id);
            expect(result).toEqual(new ProfileResponseDTO(user));
        });

        it('throws NotFoundError when the user does not exist', async () => {
            mockUserRepo.getUserById.mockResolvedValue(null);

            await expect(userService.getProfile('missing-id')).rejects.toThrow(
                Messages.USER_NOT_FOUND,
            );
            await expect(
                userService.getProfile('missing-id'),
            ).rejects.toBeInstanceOf(NotFoundError);
        });
    });

    describe('checkByEmail / checkByUsername', () => {
        it('checkByEmail delegates to the repository', async () => {
            mockUserRepo.checkByEmail.mockResolvedValue(true);

            const result = await userService.checkByEmail('a@example.com');

            expect(mockUserRepo.checkByEmail).toHaveBeenCalledWith(
                'a@example.com',
            );
            expect(result).toBe(true);
        });

        it('checkByUsername delegates to the repository', async () => {
            mockUserRepo.checkByUsername.mockResolvedValue(false);

            const result = await userService.checkByUsername('someone');

            expect(mockUserRepo.checkByUsername).toHaveBeenCalledWith(
                'someone',
            );
            expect(result).toBe(false);
        });
    });

    describe('updateUser', () => {
        it('updates fields with no email/username change and does not touch verification', async () => {
            const existing = buildUser({
                email: 'same@example.com',
                username: 'same-user',
            });
            const updated = { ...existing, name: 'New Name' };
            mockUserRepo.getUserById.mockResolvedValue(existing);
            mockUserRepo.update.mockResolvedValue(updated);

            const dto = buildUpdateUserDTO({
                name: 'New Name',
                email: 'same@example.com',
                username: 'same-user',
            });
            const result = await userService.updateUser(existing.id, dto);

            expect(mockUserRepo.update).toHaveBeenCalledWith(existing.id, dto);
            expect(sendVerificationEmailMock).not.toHaveBeenCalled();
            expect(result).toEqual(new UserResponseDTO(updated));
        });

        it('throws ConflictError when the new email is already in use', async () => {
            const existing = buildUser({ email: 'old@example.com' });
            mockUserRepo.getUserById.mockResolvedValue(existing);
            mockUserRepo.checkByEmail.mockResolvedValue(true);

            const dto = buildUpdateUserDTO({ email: 'taken@example.com' });

            await expect(
                userService.updateUser(existing.id, dto),
            ).rejects.toThrow(ConflictError);
            await expect(
                userService.updateUser(existing.id, dto),
            ).rejects.toThrow(Messages.EMAIL_ALREADY_IN_USE);
            expect(mockUserRepo.update).not.toHaveBeenCalled();
        });

        it('sets isVerified=false and sends a verification email when email changes', async () => {
            const existing = buildUser({ email: 'old@example.com' });
            const updated = {
                ...existing,
                email: 'new@example.com',
                isVerified: false,
            };
            mockUserRepo.getUserById.mockResolvedValue(existing);
            mockUserRepo.checkByEmail.mockResolvedValue(false);
            mockUserRepo.update.mockResolvedValue(updated);
            signEmailTokenMock.mockReturnValue('signed-token');

            const dto = buildUpdateUserDTO({ email: 'new@example.com' });
            const result = await userService.updateUser(existing.id, dto);

            const expectedUpdatePayload = { ...dto, isVerified: false };
            expect(mockUserRepo.update).toHaveBeenCalledWith(
                existing.id,
                expectedUpdatePayload,
            );
            expect(signEmailTokenMock).toHaveBeenCalledWith(updated.id);
            expect(sendVerificationEmailMock).toHaveBeenCalledWith(
                updated.email,
                'signed-token',
            );
            expect(result).toEqual(new UserResponseDTO(updated));
        });

        it('throws ConflictError when the new username is already in use', async () => {
            const existing = buildUser({
                username: 'old-name',
                email: 'same@example.com',
            });
            mockUserRepo.getUserById.mockResolvedValue(existing);
            mockUserRepo.checkByUsername.mockResolvedValue(true);

            const dto = buildUpdateUserDTO({
                username: 'taken-name',
                email: 'same@example.com',
            });

            await expect(
                userService.updateUser(existing.id, dto),
            ).rejects.toThrow(ConflictError);
            await expect(
                userService.updateUser(existing.id, dto),
            ).rejects.toThrow(Messages.USERNAME_ALREADY_IN_USE);
            expect(mockUserRepo.update).not.toHaveBeenCalled();
        });

        it(
            'documents current behavior: when both email and username change, ' +
                'only the email-uniqueness check runs (username check is skipped)',
            async () => {
                const existing = buildUser({
                    email: 'old@example.com',
                    username: 'old-name',
                });
                const updated = {
                    ...existing,
                    email: 'new@example.com',
                    username: 'new-name',
                    isVerified: false,
                };
                mockUserRepo.getUserById.mockResolvedValue(existing);
                mockUserRepo.checkByEmail.mockResolvedValue(false);
                mockUserRepo.update.mockResolvedValue(updated);

                const dto = buildUpdateUserDTO({
                    email: 'new@example.com',
                    username: 'new-name',
                });
                await userService.updateUser(existing.id, dto);

                expect(mockUserRepo.checkByEmail).toHaveBeenCalledWith(
                    'new@example.com',
                );
                expect(mockUserRepo.checkByUsername).not.toHaveBeenCalled();
            },
        );

        it('propagates NotFoundError when the user being updated does not exist', async () => {
            mockUserRepo.getUserById.mockResolvedValue(null);

            await expect(
                userService.updateUser('missing-id', buildUpdateUserDTO()),
            ).rejects.toThrow(NotFoundError);
        });
    });

    describe('updateProfile', () => {
        it('updates the profile and returns a ProfileResponseDTO', async () => {
            const existing = buildUser({ email: 'same@example.com' });
            const updated = { ...existing, name: 'Updated Name' };
            mockUserRepo.getUserById.mockResolvedValue(existing);
            mockUserRepo.update.mockResolvedValue(updated);

            const dto = buildUpdateProfileDTO({ name: 'Updated Name' });
            const result = await userService.updateProfile(existing.id, dto);

            expect(mockUserRepo.update).toHaveBeenCalledWith(existing.id, dto);
            expect(result).toEqual(new ProfileResponseDTO(updated));
        });

        it('sends a verification email when the profile update changes the email', async () => {
            const existing = buildUser({ email: 'old@example.com' });
            const updated = {
                ...existing,
                email: 'new@example.com',
                isVerified: false,
            };
            mockUserRepo.getUserById.mockResolvedValue(existing);
            mockUserRepo.checkByEmail.mockResolvedValue(false);
            mockUserRepo.update.mockResolvedValue(updated);
            signEmailTokenMock.mockReturnValue('signed-token');

            const dto = buildUpdateProfileDTO({
                email: 'new@example.com',
            } as never);
            const result = await userService.updateProfile(existing.id, dto);

            expect(sendVerificationEmailMock).toHaveBeenCalledWith(
                updated.email,
                'signed-token',
            );
            expect(result).toEqual(new ProfileResponseDTO(updated));
        });
    });

    describe('softDeleteUser', () => {
        it('soft-deletes via the account repository when the user exists', async () => {
            const existing = buildUser();
            const deleted = { ...existing, isDeleted: true };
            mockUserRepo.checkById.mockResolvedValue(true);
            mockAccountRepo.softDeleteUserWithAuth.mockResolvedValue(deleted);

            const result = await userService.softDeleteUser(existing.id);

            expect(mockUserRepo.checkById).toHaveBeenCalledWith(existing.id);
            expect(mockAccountRepo.softDeleteUserWithAuth).toHaveBeenCalledWith(
                existing.id,
            );
            expect(result).toEqual(new UserResponseDTO(deleted));
        });

        it('throws NotFoundError and never calls the account repository when the user does not exist', async () => {
            mockUserRepo.checkById.mockResolvedValue(false);

            await expect(
                userService.softDeleteUser('missing-id'),
            ).rejects.toThrow(NotFoundError);
            expect(
                mockAccountRepo.softDeleteUserWithAuth,
            ).not.toHaveBeenCalled();
        });
    });
});
