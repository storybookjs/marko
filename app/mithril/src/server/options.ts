import { sync } from 'read-pkg-up';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'mithril',
  frameworkPresets: [require.resolve('./framework-preset-mithril.js')],
};
