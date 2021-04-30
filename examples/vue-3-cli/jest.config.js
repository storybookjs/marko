const config = require('../../jest.config');

module.exports = {
  ...config,
  roots: [__dirname],
  transform: {
    ...config.transform,
    '.*\\.(vue)$': require.resolve('vue-jest'),
  },
  moduleFileExtensions: [...config.moduleFileExtensions, 'vue'],
};
