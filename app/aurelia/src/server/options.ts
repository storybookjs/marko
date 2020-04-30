// tslint:disable-next-line: no-var-requires
const packageJson = require('../../package.json');

export default {
  packageJson,
  framework: 'aurelia',
  frameworkPresets: [require.resolve('./framework-preset-aurelia.js')],
};
