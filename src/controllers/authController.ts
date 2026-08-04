import { AuthService } from '../services/authService';
import { asyncHandler } from '../utils/asyncHandler';
import { httpStatusCodes } from '../constants/statusCode';
import { sendResponse } from '../utils/response';
import { clearAuthCookie, setAuthCookie } from '../utils/setCookie';

const authService = new AuthService();

export const AuthController = {
    signup: asyncHandler(async (req, res) => {
        const result = await authService.signup(req.body);
        sendResponse(res, httpStatusCodes.CREATED, result);
    }),

    login: asyncHandler(async (req, res) => {
        const result = await authService.login(req.body);
        setAuthCookie(res, result.token);

        sendResponse(res, httpStatusCodes.OK, { user: result.user });
    }),

    confirmEmail: asyncHandler(async (req, res) => {
        const token = req.params.token as string;
        const result = await authService.confirmEmail(token);
        sendResponse(res, httpStatusCodes.OK, result);
    }),

    resendVerification: asyncHandler(async (req, res) => {
        await authService.resendVerification(req.body.email);
        sendResponse(res, httpStatusCodes.OK);
    }),

    changePassword: asyncHandler(async (req, res) => {
        const userId = req.user!.userId;
        const result = await authService.changePassword(userId, req.body);
        sendResponse(res, httpStatusCodes.OK, result);
    }),

    confirmPasswordChange: asyncHandler(async (req, res) => {
        const result = await authService.confirmPasswordChange(req.body);
        sendResponse(res, httpStatusCodes.OK, result);
    }),

    logout: asyncHandler(async (req, res) => {
        clearAuthCookie(res);
        sendResponse(res, httpStatusCodes.OK);
    }),
};
