const packageJson = require('../../package.json');

export default {
  packageJson,
  framework: 'web-components',
  frameworkPresets: [require.resolve('./framework-preset-web-components.js')],
};
