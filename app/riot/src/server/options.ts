import { sync } from 'read-pkg-up';
import { LoadOptions } from '@storybook/core-common';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'riot',
  frameworkPresets: [require.resolve('./framework-preset-riot.js')],
} as LoadOptions;
