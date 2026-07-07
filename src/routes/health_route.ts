import { Router } from 'express';
import { httpStatusCodes } from '../constants/statusCode';
import prisma from '../config/prisma';
const router = Router();

router.get('/', async (req, res) => {
    try {
        await prisma.$connect();
        res.status(httpStatusCodes.OK).json({
            status: 'ok',
            message: 'server is healthy',
        });
    } catch (error) {
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'down',
            message: 'internal server error',
            db: 'down',
        });
    }
});

export default router;
