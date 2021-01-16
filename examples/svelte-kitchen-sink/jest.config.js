const config = require('../../jest.config');

module.exports = {
  ...config,
  roots: [__dirname],
  transform: {
    ...config.transform,
    '.*\\.(svelte)$': '<rootDir>/scripts/utils/jest-transform-svelte',
  },
  moduleNameMapper: {
    '!!raw-loader!.*': '<rootDir>/__mocks__/fileMock.js',
  },
  moduleFileExtensions: [...config.moduleFileExtensions, 'svelte'],
};
