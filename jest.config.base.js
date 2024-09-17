module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^@loomia/shared-ui/(.*)$': '<rootDir>/packages/shared-ui/src/$1',
      '^@loomia/shared-utils/(.*)$': '<rootDir>/packages/shared-utils/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  };
  