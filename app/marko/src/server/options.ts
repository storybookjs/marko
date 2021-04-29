import { sync } from 'read-pkg-up';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'marko',
  frameworkPresets: [require.resolve('./framework-preset-marko.js')],
};
