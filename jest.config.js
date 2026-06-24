const path = require('path');

// Normalise to forward-slash paths for Jest's moduleNameMapper replacement
const rootDir = __dirname.replace(/\\/g, '/');

module.exports = {
  rootDir: __dirname,
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: [path.join(__dirname, 'jest.setup.js')],
  moduleNameMapper: {
    '^@/(.*)$': rootDir + '/$1',
    '^next/link$': path.join(__dirname, '__mocks__/next-link.js'),
  },
  transform: {
    '^.+\\.(js|jsx|mjs)$': ['babel-jest', { configFile: false, presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm)?)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', path.join(__dirname, 'tests')],
};
