import { ValidatedData } from '../middlewares/validate';
import { JwtPayload } from '../utils/jwt';

declare global {
    namespace Express {
        interface Request {
            validated: ValidatedData;
            user: JwtPayload;
        }
    }
}

export {};
