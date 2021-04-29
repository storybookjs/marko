import { sync } from 'read-pkg-up';
import { LoadOptions } from '@storybook/core-common';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'aurelia',
  frameworkPresets: [require.resolve('./framework-preset-aurelia.js')],
} as LoadOptions;
