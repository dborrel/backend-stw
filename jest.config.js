module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest-setup.js'],
  globalTeardown: '<rootDir>/src/tests/jest-teardown.js',
  testTimeout: 30000,
  detectOpenHandles: true,
  forceExit: true,
  testMatch: ['<rootDir>/src/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/tests/**',
    '!src/server.js'
  ]
};
