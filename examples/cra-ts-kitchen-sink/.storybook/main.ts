// eslint-disable-next-line import/no-extraneous-dependencies
import { Configuration } from 'webpack';

const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.@(mdx|tsx|ts|jsx|js)'],
  logLevel: 'debug',
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    './localAddon/register.tsx',
    './localAddon/preset.ts',
  ],
  webpackFinal: (config: Configuration) => {
    // add monorepo root as a valid directory to import modules from
    config.resolve.plugins.forEach((p) => {
      // @ts-ignore
      if (Array.isArray(p.appSrcs)) {
        // @ts-ignore
        p.appSrcs.push(path.join(__dirname, '..', '..', '..'));
      }
    });
    return config;
  },
};
