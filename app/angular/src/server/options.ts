import { sync } from 'read-pkg-up';
import { LoadOptions } from '@storybook/core-common';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'angular',
  frameworkPresets: [
    require.resolve('./framework-preset-angular.js'),
    require.resolve('./framework-preset-angular-cli.js'),
  ],
} as LoadOptions;
