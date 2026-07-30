import { resetAllUtilityMocks } from './mocks/utilities.mock';
import { afterAll, beforeAll, beforeEach, jest } from '@jest/globals';

const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
});

beforeEach(() => {
    resetAllUtilityMocks();
});

afterAll(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
});
