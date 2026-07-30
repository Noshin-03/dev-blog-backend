import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    clearMocks: true,

    collectCoverageFrom: ['src/controllers/*.ts', 'src/services/*.ts'],
    coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
};

export default config;
