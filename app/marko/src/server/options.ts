import { sync } from 'read-pkg-up';
import { LoadOptions } from '@storybook/core-common';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'marko',
  frameworkPresets: [require.resolve('./framework-preset-marko.js')],
} as LoadOptions;
