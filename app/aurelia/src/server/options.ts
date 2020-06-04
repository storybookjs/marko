const packageJson = require('../../package.json');

export default {
  packageJson,
  framework: 'aurelia',
  frameworkPresets: [require.resolve('./framework-preset-aurelia.js')],
};
