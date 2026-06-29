import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { asyncHandler } from '../utils/asyncHandler';
<<<<<<< HEAD
import { httpStatusCodes, paginationDefaults } from '../constants/statusCode';
import { sendResponse } from '../utils/response';
=======
>>>>>>> 33d57aa (feat: implement crud operation for user)

const userService = new UserService();

export const UserController = {
    createUser: asyncHandler(async (req: Request, res: Response) => {
        const user = await userService.createUser(req.body);
<<<<<<< HEAD
        sendResponse(res, httpStatusCodes.CREATED, user);
    }),

    getAllUsers: asyncHandler(async (req: Request, res: Response) => {
        const page = Number(req.query.page) || paginationDefaults.PAGE;
        const limit = Number(req.query.limit) || paginationDefaults.LIMIT;
        const users = await userService.getAllUsers({ page, limit });
        sendResponse(res, httpStatusCodes.OK, users);
=======
        res.status(201).json({ 
            status: 'success', 
            data: user 
        });
    }),

    getAllUsers: asyncHandler(async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const users = await userService.getAllUsers({ page, limit });
        res.status(200).json({ 
            status: 'success', data: users 
        });
>>>>>>> 33d57aa (feat: implement crud operation for user)
    }),

    getUserById: asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.userId);
        const user = await userService.getUserById(id);
<<<<<<< HEAD
        sendResponse(res, httpStatusCodes.OK, user);
=======
        res.status(200).json({ 
            status: 'success', 
            data: user 
        });
>>>>>>> 33d57aa (feat: implement crud operation for user)
    }),

    updateUser: asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.userId);
        const user = await userService.updateUser(id, req.body);
<<<<<<< HEAD
        sendResponse(res, httpStatusCodes.OK, user);
=======
        res.status(200).json({ 
            status: 'success', 
            data: user 
        });
>>>>>>> 33d57aa (feat: implement crud operation for user)
    }),

    deleteUser: asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.userId);
        await userService.softDeleteUser(id);
<<<<<<< HEAD
        sendResponse(res, httpStatusCodes.OK, undefined, 'User deleted successfully');
    }),
};
=======
        res.status(200).json({ 
            status: 'success', 
            message: 'User deleted successfully' 
        });
    }),
};
>>>>>>> 33d57aa (feat: implement crud operation for user)
