---
title: 'Frequently Asked Questions'
---

Here are some answers to frequently asked questions. If you have a question, you can ask it by opening an issue on the [Storybook Repository](https://github.com/storybookjs/storybook/).

### How can I run coverage tests with Create React App and leave out stories?

Create React App does not allow providing options to Jest in your `package.json`, however you can run `jest` with commandline arguments:

```sh
npm test -- --coverage --collectCoverageFrom='["src/**/*.{js,jsx}","!src/**/stories/*"]'
```

### I see `ReferenceError: React is not defined` when using storybooks with Next.js

Next automatically defines `React` for all of your files via a babel plugin. You must define `React` for JSX to work. You can solve this either by:

1.  Adding `import React from 'react'` to your component files.
2.  Adding a `.babelrc` that includes [`babel-plugin-react-require`](https://www.npmjs.com/package/babel-plugin-react-require)

### How do I setup Storybook to share Webpack configuration with Next.js?

You can generally reuse webpack rules by placing them in a file that is `require()`-ed from both your `next.config.js` and your `.storybook/main.js` files. For example:

```js
module.exports = {
  webpackFinal: async (baseConfig) => {
    const nextConfig = require('/path/to/next.config.js');

    // merge whatever from nextConfig into the webpack config storybook will use
    return { ...baseConfig };
  },
};
```

### How do I setup React Fast Refresh with Storybook?

Fast refresh is an opt-in feature that can be used in Storybook React.
There are two ways that you can enable it, go ahead and pick one:

* You can set a `FAST_REFRESH` environment variable in your `.env` file:
```
FAST_REFRESH=true
```

* Or you can set the following properties in your `.storybook/main.js` files:
```js
module.exports = {
  reactOptions: {
    fastRefresh: true,
  }
};
```

**Note: Fast Refresh requires React 16.10 or higher and is only enabled in development mode.**

### Why is there no addons channel?

A common error is that an addon tries to access the "channel", but the channel is not set. This can happen in a few different cases:

1.  You're trying to access addon channel (e.g. by calling `setOptions`) in a non-browser environment like Jest. You may need to add a channel mock:
    ```js
    import addons, { mockChannel } from '@storybook/addons';

    addons.setChannel(mockChannel());
    ```

2.  In React Native, it's a special case that's documented in [#1192](https://github.com/storybookjs/storybook/issues/1192)

### Can I modify React component state in stories?

Not directly. If you control the component source, you can do something like this:

```js
import React, { Component } from 'react';

export default {
  title: 'MyComponent',
};

class MyComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      someVar: 'defaultValue',
      ...props.initialState,
    };
  }
  // ...
};

export const defaultView = () => <MyComponent initialState={} />;
```

### Which community addons are compatible with the latest version of Storybook?

Starting with Storybook version 6.0 we've introduced some great features aimed at streamlining your development workflow.

With this we would like to point out that if you plan on using addons created by our fantastic community, you need to take in consideration that some of those addons might be working with a outdated version of Storybook. 

We're actively working in providing a better way to address this situation, but in the meantime we would ask a bit of caution on your end so that you don't run into unexpected problems. Let us know by creating a issue in the [Storybook repo](https://github.com/storybookjs/storybook/issues) so that we can gather information and create a curated list with those addons to help not only you but the rest of the community.
