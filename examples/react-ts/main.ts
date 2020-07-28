import type { StorybookConfig } from '@storybook/core/types';

module.exports = {
  stories: ['./src/*.stories.*'],
  logLevel: 'debug',
  addons: ['@storybook/addon-essentials', '@storybook/addon-controls'],
  typescript: {
    check: true,
    checkOptions: {},
    reactDocgenTypescriptOptions: {
      propFilter: (prop) => ['label', 'disabled'].includes(prop.name),
    },
  },
} as StorybookConfig;
