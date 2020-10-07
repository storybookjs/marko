const path = require('path');

module.exports = {
  stories: ['../src/stories/**/*.stories.@(js|mdx)'],
  logLevel: 'debug',
  reactOptions: {
    fastRefresh: true,
  },
  addons: [
    '@storybook/preset-create-react-app',
    {
      name: '@storybook/addon-docs/preset',
      options: {
        configureJSX: true,
      },
    },
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-events',
    '@storybook/addon-knobs',
    '@storybook/addon-backgrounds',
    '@storybook/addon-a11y',
    '@storybook/addon-jest',
  ],
  webpackFinal: (config) => {
    // add monorepo root as a valid directory to import modules from
    config.resolve.plugins.forEach((p) => {
      if (Array.isArray(p.appSrcs)) {
        p.appSrcs.push(path.join(__dirname, '..', '..', '..'));
      }
    });
    return config;
  },
};
