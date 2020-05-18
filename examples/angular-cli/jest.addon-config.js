const config = require('./jest.config.js');

module.exports = {
  ...config,
  testPathIgnorePatterns: ['/node_modules/', '/storybook-static/', 'angularshots.test.js', 'dist'],
};
