import type { StorybookConfig } from '@storybook/core/types';

module.exports = {
  stories: [
    // FIXME: Breaks e2e tests './intro.stories.mdx',
    '../../lib/ui/src/**/*.stories.@(js|tsx|mdx)',
    '../../lib/components/src/**/*.stories.@(js|tsx|mdx)',
    './stories/**/*.stories.@(js|ts|tsx|mdx)',
    './../../addons/docs/**/*.stories.tsx',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-storysource',
    '@storybook/addon-design-assets',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-events',
    '@storybook/addon-knobs',
    '@storybook/addon-controls',
    '@storybook/addon-cssresources',
    '@storybook/addon-backgrounds',
    '@storybook/addon-a11y',
    '@storybook/addon-jest',
    '@storybook/addon-viewport',
    '@storybook/addon-graphql',
    '@storybook/addon-toolbars',
    '@storybook/addon-queryparams',
  ],
  logLevel: 'debug',
} as StorybookConfig;
