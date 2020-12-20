import { sync } from 'read-pkg-up';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  frameworkPresets: [require.resolve('./framework-preset-marionette.js')],
};
