---
id: 'typescript-config'
title: 'TypeScript Config'
---

Storybook has built-in Typescript support, so your Typescript project should work with zero configuration needed.

- [Default configuration](#default-configuration)
- [Main.js configuration](#mainjs-configuration)
- [Manual configuration](#manual-configuration)
- [More Resources](#more-resources)

## Default configuration

The base Typescript configuration uses `babel-loader` for Typescript transpilation, and optionally `fork-ts-checker-webpack-plugin` for checking.

Each framework uses the base configuration unless otherwise specified:

- **Angular** ignores the base and uses `ts-loader` and `ngx-template-loader`.
- **Vue** ignores the uses `ts-loader` and applies it to both `.tsx?` and `.vue` files.
- **React** adds `react-docgen-typescript-plugin` the base.

## Main.js configuration

To make it easier to configure Typescript handling, we've added a new field, `typescript`, to [`main.js`](../overview/index.md).

Here are the default values:

```js
module.exports = {
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};
```

And here are the meaning of each field:

| Field                            | Framework | Description                                                                                  | Type                                                                          |
| -------------------------------- | --------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **check**                        | All       | optionally run `fork-ts-checker-webpack-plugin`                                              | `boolean`                                                                     |
| **checkOptions**                 | All       | Options to pass to `fork-ts-checker-webpack-plugin` if it's enabled                          | [See docs](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin)      |
| **reactDocgen**                  | React     | which variant docgen processor to run                                                        | `'react-docgen-typescript' | 'react-docgen' | false`                          |
| **reactDocgenTypescriptOptions** | React     | Options to pass to `react-docgen-typescript-plugin` if `react-docgen-typescript` is enabled. | [See docs](https://github.com/hipstersmoothie/react-docgen-typescript-plugin) |

## Manual configuration

Manual configuration support will be added in a later pre-release.

## More Resources

- [Storybook, React, TypeScript and Jest](https://medium.com/@mtiller/storybook-react-typescript-and-jest-c9059ea06fa7)
- [React, Storybook & TypeScript](http://www.joshschreuder.me/react-storybooks-with-typescript/)
