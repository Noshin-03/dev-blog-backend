import type { Request, Response } from 'express';
import { jest } from '@jest/globals';

type MockRes = Response & {
    status: jest.Mock<any>;
    json: jest.Mock<any>;
    cookie: jest.Mock<any>;
    clearCookie: jest.Mock<any>;
};

export function createMockRes(): MockRes {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const cookie = jest.fn();
    const clearCookie = jest.fn();
    return { status, json, cookie, clearCookie } as unknown as MockRes;
}

export function createMockReq(overrides: Partial<Request> = {}): Request {
    return overrides as unknown as Request;
}
