import { ValidatedData } from '../middlewares/validate';
import { JwtPayload } from '../utils/jwt';

export {};

declare global {
    namespace Express {
        interface Request {
            validated: ValidatedData;
            user?: JwtPayload;
        }
    }
}
