import { sync } from 'read-pkg-up';
import { LoadOptions } from '@storybook/core-common';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'vue3',
  frameworkPresets: [require.resolve('./framework-preset-vue3')],
} as LoadOptions;
