import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { AuthRepository } from '../repositories/authRepository';
import {
    RegisterDTO,
    LoginDto,
    ChangepasswordDTO,
    ConfirmPasswordChangeDTO,
} from '../dtos/authDTO';
import {
    signPasswordChangeToken,
    verifyPasswordChangeToken,
    signToken,
    signEmailToken,
    verifyEmailToken,
} from '../utils/jwt';
import {
    ConflictError,
    NotFoundError,
    UnauthorizedError,
    ValidationError,
} from '../common/errorsClass';
import { Messages } from '../constants/messages';
import { UserService } from './userService';
import { AccountRepository } from '../repositories/accountRepository';
import {
    sendVerificationEmail,
    sendPasswordChangeEmail,
    sendPasswordChangedNotification,
} from '../utils/mailer';
import { consumeToken } from '../utils/rateLimiter';

const SALT_ROUNDS = 10;

const accountRepository = new AccountRepository(prisma);
const authRepository = new AuthRepository(prisma);
const userService = new UserService();

export class AuthService {
    async signup(data: RegisterDTO) {
        const exitingEmail = await userService.checkByEmail(data.email);
        if (exitingEmail) {
            throw new ConflictError(Messages.EMAIL_ALREADY_IN_USE);
        }

        const existingUsername = await userService.checkByUsername(
            data.username,
        );
        if (existingUsername) {
            throw new ConflictError(Messages.USERNAME_ALREADY_IN_USE);
        }

        const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

        const user = await accountRepository.createUserWithAuth({
            username: data.username,
            name: data.name,
            email: data.email,
            passwordHash,
        });

        const emailToken = signEmailToken(user.id);
        await sendVerificationEmail(user.email, emailToken);

        // const token = signToken({
        //     userId: user.id,
        //     username: user.username,
        //     email: user.email,
        //     role: user.role,
        // });

        return {
            //token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
            },
        };
    }

    async login(data: LoginDto) {
        const user = await userService.getUserByEmail(data.email);

        const auth = await authRepository.checkAuthByUserId(user.id);
        if (!user || !auth) {
            throw new UnauthorizedError(Messages.INVALID_CREDENTIALS);
        }

        const passwordMatch = await bcrypt.compare(
            data.password,
            auth.password,
        );

        if (!passwordMatch) {
            throw new UnauthorizedError(Messages.INVALID_CREDENTIALS);
        }

        if (!user.isVerified) {
            const emailToken = signEmailToken(user.id);
            await sendVerificationEmail(user.email, emailToken);
            throw new UnauthorizedError(Messages.EMAIL_NOT_VERIFIED);
        }

        const token = signToken({
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        });

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    async changePassword(userId: string, data: ChangepasswordDTO) {
        const auth = await authRepository.checkAuthByUserId(userId);
        if (!auth) {
            throw new UnauthorizedError(Messages.INVALID_CREDENTIALS);
        }

        const passwordMatch = await bcrypt.compare(
            data.oldPassword,
            auth.password,
        );
        if (!passwordMatch) {
            throw new UnauthorizedError(Messages.INVALID_CREDENTIALS);
        }

        const token = signPasswordChangeToken(userId);

        await authRepository.savePasswordChangeToken(userId, token);

        await sendPasswordChangeEmail(auth.user.email, token);

        return Messages.PASSWORD_CHANGE_EMAIL_SENT;
    }

    async confirmPasswordChange(data: ConfirmPasswordChangeDTO) {
        const passwordChange = await authRepository.checkByToken(data.token);

        if (!passwordChange) {
            throw new UnauthorizedError(Messages.INVALID_TOKEN);
        }

        if (!passwordChange.isValid) {
            throw new UnauthorizedError(Messages.INVALID_TOKEN);
        }

        const payload = verifyPasswordChangeToken(data.token);

        if (payload.purpose !== 'password-change') {
            throw new ValidationError(Messages.INVALID_TOKEN);
        }

        const auth = await authRepository.checkAuthByUserId(payload.userId);

        if (!auth) {
            throw new UnauthorizedError(Messages.INVALID_CREDENTIALS);
        }

        const isSamePassword = await bcrypt.compare(
            data.newPassword,
            auth.password,
        );

        if (isSamePassword) {
            throw new ValidationError(Messages.PASSWORD_INVALID);
        }

        const hashedPassword = await bcrypt.hash(data.newPassword, SALT_ROUNDS);

        await authRepository.changePassword(payload.userId, hashedPassword);

        await authRepository.invalidatePasswordChangeToken(payload.userId);

        await sendPasswordChangedNotification(auth.user.email);

        return Messages.CHANGED;
    }

    async confirmEmail(token: string) {
        let payload;
        try {
            payload = verifyEmailToken(token);
        } catch (err: any) {
            if (err.name === 'TokenExpiredError') {
                throw new ValidationError(Messages.VERIFICATION_LINK_EXPIRED);
            }

            throw new ValidationError(Messages.INVALID_VERIFICATION_LINK);
        }

        if (payload.purpose !== 'email-verification') {
            throw new ValidationError(Messages.INVALID_VERIFICATION_LINK);
        }

        const auth = await userService.getUserById(payload.userId);

        if (!auth) {
            throw new NotFoundError(Messages.USER_NOT_FOUND);
        }

        if (!auth.isVerified) {
            await authRepository.markEmailVerified(payload.userId);
        }

        return {
            message: Messages.EMAIL_VERIFIED,
        };
    }

    async resendVerification(email: string) {
        const user = await userService.getUserByEmail(email);

        if (!user) {
            throw new UnauthorizedError(Messages.USER_NOT_FOUND);
        }

        if (user.isVerified) {
            throw new ValidationError(Messages.EMAIL_ALREADY_VERIFIED);
        }

        if (!consumeToken(user.email)) {
            throw new ValidationError(Messages.TOO_MANY_REQUESTS);
        }

        const emailToken = signEmailToken(user.id);

        await sendVerificationEmail(user.email, emailToken);

        return {
            message: Messages.VERIFICATION_EMAIL_SENT,
        };
    }
}
