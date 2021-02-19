import { sync } from 'read-pkg-up';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'html',
  frameworkPresets: [require.resolve('./framework-preset-html')],
};
