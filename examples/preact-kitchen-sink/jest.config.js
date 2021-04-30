const config = require('../../jest.config');

module.exports = {
  ...config,
  roots: [__dirname],
  moduleNameMapper: {
    '^react$': 'preact/compat',
    '^react-dom/test-utils$': 'preact/test-utils',
    '^react-dom$': 'preact/compat',
    '^enzyme-adapter-react-16$': '<rootDir>/examples/preact-kitchen-sink/preact-enzyme-mapping.js',
  },
};
