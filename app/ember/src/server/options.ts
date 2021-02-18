import { sync } from 'read-pkg-up';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'ember',
  frameworkPresets: [require.resolve('./framework-preset-babel-ember.js')],
};
