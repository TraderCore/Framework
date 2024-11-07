const jestConfig = require('@tradercore/jest-config/jest.js');

/** @type {import('jest').Config} */
const config = {
    ...jestConfig,
    verbose: true,
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};

module.exports = config;
