import { sync } from 'read-pkg-up';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'riot',
  frameworkPresets: [require.resolve('./framework-preset-riot.js')],
};
