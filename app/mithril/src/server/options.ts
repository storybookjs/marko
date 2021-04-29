import { sync } from 'read-pkg-up';
import { LoadOptions } from '@storybook/core-common';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'mithril',
  frameworkPresets: [require.resolve('./framework-preset-mithril.js')],
} as LoadOptions;
