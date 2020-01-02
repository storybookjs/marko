module.exports = {
  // this dirname is because we run tests from project root
  stories: [`${__dirname}/../stories/*.stories.*`],

  presets: ['@storybook/addon-docs/preset'],
  addons: [
    '@storybook/addon-a11y/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-backgrounds/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-links/register',
    '@storybook/addon-notes/register',
    '@storybook/addon-options/register',
  ],
};
