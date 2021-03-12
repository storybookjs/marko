import { sync } from 'read-pkg-up';
import { LoadOptions } from '@storybook/core-common';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'svelte',
  frameworkPresets: [require.resolve('./framework-preset-svelte.js')],
} as LoadOptions;
