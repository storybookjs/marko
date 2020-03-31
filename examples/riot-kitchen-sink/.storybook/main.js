const path = require('path');

module.exports = {
  stories: ['../src/stories/**/*.stories.js'],
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
    '@storybook/addon-a11y',
  ],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: [/\.stories\.js$/, /index\.js$/],
      loaders: [require.resolve('@storybook/source-loader')],
      include: [path.resolve(__dirname, '../src')],
      enforce: 'pre',
    });
    config.module.rules.push({
      test: /\.txt$/,
      use: 'raw-loader',
    });
    return config;
  },
};
