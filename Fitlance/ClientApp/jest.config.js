const config = {
    transform: {
        '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!axios).+\\.js$',
    ],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/styleMock.js',
        '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    },
    testEnvironment: 'jsdom',
    verbose: true,
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"]
};

module.exports = config;