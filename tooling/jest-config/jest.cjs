/** @type {import('jest').Config} */
const config = {
    verbose: true,
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': [
            '@swc/jest',
            {
                jsc: {
                    target: 'es2022',
                    parser: {
                        syntax: 'typescript',
                        decorators: true,
                    },

                    transform: {
                        legacyDecorator: true,
                        decoratorMetadata: true,
                    },
                },
            },
        ],
    },
    transformIgnorePatterns: ['node_modules', 'dist'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    extensionsToTreatAsEsm: ['.ts'],
};

module.exports = config;
