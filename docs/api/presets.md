---
title: 'Presets'
---

Presets are grouped collections of `babel`, `webpack`, and `addons` configurations that support specific use cases.

For example, to use [SCSS](https://sass-lang.com/) styling rather than manually configuring Storybook's [webpack](../configure/webpack.md#extending-storybooks-webpack-config) config, you can use the [`@storybook/preset-scss`](https://www.npmjs.com/package/@storybook/preset-scss) package, which does the heavy lifting for you.

#### Existing presets

Storybook-maintained presets are available in the [presets repo](https://github.com/storybookjs/presets).

- [Create React App](https://github.com/storybookjs/presets/tree/master/packages/preset-create-react-app)
- [SCSS](https://github.com/storybookjs/presets/tree/master/packages/preset-scss)
- [TypeScript](https://github.com/storybookjs/presets/tree/master/packages/preset-typescript)
- [Ant Design](https://github.com/storybookjs/presets/tree/master/packages/preset-ant-design)

## Basic usage

Each preset has its own installation instructions, but the idea of presets is to install an addon and then load its preset.

For example, to use SCSS styling, first install the addon and the required dependencies:

```sh
yarn add -D @storybook/preset-scss css-loader sass-loader style-loader
```

Then load it in the file `main.js` in your storybook folder (`.storybook` by default):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-preset-config.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

That's it. When Storybook starts up, it will configure itself to use SCSS styling without any further configuration. For more information, see the SCSS preset [README](https://github.com/storybookjs/presets/blob/master/packages/preset-scss/).

## Preset configuration

Presets can also take optional parameters. These can be used by the preset itself or passed through to configure the webpack loaders that are used by the preset.

Consider this example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preset-configuration.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

This configures the CSS loader to use  modules and how the styling will be defined.

Each preset has its own option and those options should be documented in the preset's README.


## Go deeper

To understand more about how presets work and write your own, see [writing presets](./writing-presets.md).