import { Request } from 'express';

export const getBody = <T>(req: Request): T => req.validated.body as T;

export const getParams = <T>(req: Request): T => req.validated.params as T;

export const getQuery = <T>(req: Request): T => req.validated.query as T;
