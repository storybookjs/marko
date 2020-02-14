module.exports = {
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
    '@storybook/addon-options',
    '@storybook/addon-knobs',
    '@storybook/addon-backgrounds',
    '@storybook/addon-a11y',
    '@storybook/addon-jest',
  ],
  stories: ['../src/stories/**/*.stories.(js|mdx)'],
};
