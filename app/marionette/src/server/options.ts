import { sync } from 'read-pkg-up';
import { LoadOptions } from '@storybook/core-common';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'marionette',
  frameworkPresets: [require.resolve('./framework-preset-marionette.js')],
} as LoadOptions;
