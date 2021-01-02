module.exports = {
  // this dirname is because we run tests from project root
  stories: ['../stories/**/*.stories.*'],
  logLevel: 'debug',
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-backgrounds',
    '@storybook/addon-controls',
    '@storybook/addon-events',
    '@storybook/addon-jest',
    '@storybook/addon-knobs',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    '@storybook/addon-viewport',
  ],
};
