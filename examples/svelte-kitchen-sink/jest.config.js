const config = require('../../jest.config');

module.exports = {
  ...config,
  roots: [__dirname],
  transform: {
    ...config.transform,
    '.*\\.(svelte)$': '<rootDir>/scripts/utils/jest-transform-svelte',
  },
  moduleFileExtensions: [...config.moduleFileExtensions, 'svelte'],
};
