import { sync } from 'read-pkg-up';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'server',
  frameworkPresets: [require.resolve('./framework-preset-server.js')],
};
