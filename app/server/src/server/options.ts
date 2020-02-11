// tslint:disable-next-line: no-var-requires
const packageJson = require('../../package.json');

export default {
  packageJson,
  framework: 'server',
  frameworkPresets: [require.resolve('./framework-preset-server.js')],
};
