import { AuthService } from '../services/authService';
import { asyncHandler } from '../utils/asyncHandler';
import { httpStatusCodes } from '../constants/statusCode';
import { sendResponse } from '../utils/response';
import {
    RegisterDTO,
    LoginDto,
    ResendVerificationDTO,
    ConfirmEmailDTO,
} from '../dtos/authDTO';
import { getBody, getParams } from '../utils/request';

const authService = new AuthService();

export const AuthController = {
    signup: asyncHandler(async (req, res) => {
        const body = getBody<RegisterDTO>(req);
        const result = await authService.signup(body);
        sendResponse(res, httpStatusCodes.CREATED, result);
    }),

    login: asyncHandler(async (req, res) => {
        const body = getBody<LoginDto>(req);
        const result = await authService.login(body);
        sendResponse(res, httpStatusCodes.OK, result);
    }),
    confirmEmail: asyncHandler(async (req, res) => {
        const { token } = getParams<ConfirmEmailDTO>(req);
        const result = await authService.confirmEmail(token);
        sendResponse(res, httpStatusCodes.OK, result);
    }),
    resendVerification: asyncHandler(async (req, res) => {
        const body = getBody<ResendVerificationDTO>(req);
        await authService.resendVerification(body.email);
        sendResponse(res, httpStatusCodes.OK);
    }),
};
