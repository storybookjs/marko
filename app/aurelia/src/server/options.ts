import { sync } from 'read-pkg-up';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'aurelia',
  frameworkPresets: [require.resolve('./framework-preset-aurelia.js')],
};
