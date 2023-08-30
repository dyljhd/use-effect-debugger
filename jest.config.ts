import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  roots: ['<rootDir>'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/__tests__/*.test.ts?(x)'],
  testPathIgnorePatterns: ['node_modules', 'dist'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
};

export default jestConfig;
