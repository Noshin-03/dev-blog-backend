import { AuthService } from '../services/authService';
import { asyncHandler } from '../utils/asyncHandler';
import { httpStatusCodes } from '../constants/statusCode';
import { sendResponse } from '../utils/response';
import { RegisterDTO, LoginDto } from '../dtos/authDTO';
import { getBody } from '../utils/request';

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
};
