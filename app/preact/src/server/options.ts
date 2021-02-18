import { sync } from 'read-pkg-up';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'preact',
  frameworkPresets: [require.resolve('./framework-preset-preact.js')],
};
