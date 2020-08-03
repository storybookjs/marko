---
title: 'Presets'
---

Storybook **presets** are grouped collections of `babel`, `webpack`, and `addons` configurations that support specific use cases.

For example, to write your stories in Typescript, rather than [manually configuring Storybook for typescript](../configure/integration.md#typescript) with individual [babel](../configure/integration.md#custom-configuration) and [webpack](../configure/integration.md#extending-storybook’s-webpack-config) configs, you can use the [`@storybook/preset-typescript`](https://www.npmjs.com/package/@storybook/preset-typescript) package, which does the heavy lifting for you.

## Basic usage

Each preset has its own installation instructions, but the idea of presets is to install an addon and then load its preset.

For example, to get typescript support, first install the addon:

```sh
yarn add @storybook/preset-typescript --dev
```

Then load it in the file `main.js` in your storybook folder (`.storybook` by default):

```js
module.exports = {
  addons: ['@storybook/preset-typescript'],
};
```

That's it. When Storybook starts up, it will configure itself for typescript without any further configuration. For more information, see the Typescript preset [README](https://github.com/storybookjs/presets/tree/master/packages/preset-typescript).

## Preset configuration

Presets can also take optional parameters. These can be used by the preset itself or passed through to configure the webpack loaders that are used by the preset.

Consider this example:

```js
const path = require('path');
module.exports = {
  addons: [
    {
      name: '@storybook/preset-typescript',
      options: {
        tsLoaderOptions: {
          configFile: path.resolve(__dirname, '../tsconfig.json'),
        },
        include: [path.resolve(__dirname)],
      },
    },
  ],
};
```

This configures the typescript loader using the app's `tsconfig.json` and also tells the typescript loader to only be applied to the current directory.

Each preset has its own option and those options should be documented in the preset's README.

## Go deeper

<div style="">
TODO: vet presets gallery page link
</div>

To see what presets are available, see the [preset gallery](/preset-gallery/). To understand more about how presets work and write your own, see [writing presets](./writing-presets.md).