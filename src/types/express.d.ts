import { ValidatedData } from '../middlewares/validate';

export {};

declare global {
    namespace Express {
        interface Request {
            validated: ValidatedData;
        }
    }
}
