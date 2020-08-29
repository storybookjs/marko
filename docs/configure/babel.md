---
title: 'Babel'
---

Storybook’s webpack config by [default](#default-configuration) sets up [Babel](https://babeljs.io/) for ES6 transpiling. Storybook works with evergreen browsers and IE11 by default.

Here are some key features of Storybook's Babel configurations.

### Default configuration

We have added ES2016 support with Babel for transpiling your JS code.

In addition to that, we've added a few additional features, like object spreading and async await.

Check out our [source](https://github.com/storybookjs/storybook/blob/master/lib/core/src/server/common/babel.js) to learn more about these plugins.

### Custom configuration

If your project has a `.babelrc` file, we'll use that instead of the default config file.

You can also place a `.storybook/.babelrc` file to use a special configuration for Storybook only.
