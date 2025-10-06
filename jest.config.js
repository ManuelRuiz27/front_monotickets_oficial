module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@ui/(.*)$': '<rootDir>/packages/ui/$1',
    '^@api/(.*)$': '<rootDir>/packages/api/$1',
    '^@hooks/(.*)$': '<rootDir>/packages/hooks/$1',
    '^@utils/(.*)$': '<rootDir>/packages/utils/$1',
    '^@tokens/(.*)$': '<rootDir>/packages/design-tokens/$1',
  },
  transform: {
    '^.+\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
};
