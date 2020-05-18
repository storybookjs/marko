module.exports = {
  stories: ['./src/*.stories.*'],
  addons: ['@storybook/addon-essentials'],
  typescript: {
    check: true,
    checkOptions: {},
    docgen: 'react-docgen',
  },
};
