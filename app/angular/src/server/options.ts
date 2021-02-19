import { sync } from 'read-pkg-up';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'angular',
  frameworkPresets: [
    require.resolve('./framework-preset-angular'),
    require.resolve('./framework-preset-angular-cli'),
  ],
};
