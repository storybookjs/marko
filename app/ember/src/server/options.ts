import { sync } from 'read-pkg-up';
import { LoadOptions } from '@storybook/core-common';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'ember',
  frameworkPresets: [require.resolve('./framework-preset-babel-ember.js')],
} as LoadOptions;
