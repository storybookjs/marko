import { sync } from 'read-pkg-up';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'angular',
  frameworkPresets: [
    require.resolve('./framework-preset-angular.js'),
    require.resolve('./framework-preset-angular-cli.js'),
  ],
};
