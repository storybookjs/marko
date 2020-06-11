module.exports = {
  stories: ['../src/stories/welcome.stories', '../src/stories/**/button.stories.js'],
  logLevel: 'debug',
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
};
