import { sync } from 'read-pkg-up';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'rax',
  frameworkPresets: [require.resolve('./framework-preset-rax.js')],
};
