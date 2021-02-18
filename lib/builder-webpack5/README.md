# Builder-Webpack5

Builder implemented with `webpack5` and `webpack5`-compatible loaders/plugins/config, used by `@storybook/core-server` to build the preview iframe.

To configure your Storybook to run `builder-webpack5`, install it as a dev dependency and then update your `.storybook/main.js` configuration:

```js
module.exports = {
  core: {
    builder: 'webpack5',
  },
};
```
