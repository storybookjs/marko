const config = require('../../jest.config');

module.exports = {
  ...config,
  roots: [__dirname],
  transform: {
    ...config.transform,
    '.*\\.(svelte)$': ['svelte-jester', { preprocess: require.resolve('./svelte.config.js') }],
  },
  moduleNameMapper: {
    '!!raw-loader!.*': '<rootDir>/__mocks__/fileMock.js',
  },
  moduleFileExtensions: [...config.moduleFileExtensions, 'svelte'],
};
