---
title: 'Writing your own Storybook Preset'
---

[Storybook presets](./presets.md) are grouped collections of `babel`, `webpack`, and `addons` configurations that support specific use cases in Storybook, such as typescript or MDX support.

This doc covers the [presets API](#presets-api) and how to use the presets mechanism for [advanced configuration](#advanced-configuration).

## Presets API

A preset is a set of hooks that is called by Storybook on initialization and can override configurations for `babel`, `webpack`, `addons`, and `entries`.

Each configuration has a similar signature, accepting a base configuration object and options, as in this webpack example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-webpack-preset-config.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Babel

The babel functions `babel`, `babelDefault`, and `managerBabel` all configure babel in different ways.

All functions take a [Babel configuration object](https://babeljs.io/docs/en/configuration) as their argument and can modify it or return a new object.

For example, Storybook's Mihtril support uses plugins internally and here's how it configures babel:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-babel-configuration-example.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

- `babel` is applied to the preview config, after it has been initialized by storybook
- `babelDefault` is applied to the preview config before any user presets have been applied
- `managerBabel` is applied to the manager.

### Webpack

The webpack functions `webpack`, `webpackFinal`, and `managerWebpack` configure webpack.

All functions take a [webpack4 configuration object](https://webpack.js.org/configuration/).

For example, here is how Storybook automatically adopts `create-react-app`'s configuration if it's installed, where `applyCRAWebpackConfig` is a set of smart heuristics for modifying the input config.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-webpackfinal-example.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

- `webpack` is applied to the preview config after it has been initialized by storybook
- `webpackFinal` is applied to the preview config after all user presets have been applied
- `webpackManager` is applied to the manager config

### Manager entries

The addon config `managerEntries` allows you to add addons to Storybook from within a preset. For addons that require custom webpack/babel configuration, it is easier to install the preset, and it will take care of everything.

For example, the Storysource preset contains the following code:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-storysource-manager-entries.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

This is equivalent to [registering the addon manually](../get-started/browse-stories.md#addons) in [`main.js`](../configure/overview.md#configure-story-rendering):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-use-manager-entries.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Preview entries

The addon config `config` allows you to add extra preview configuration from within a preset, for example to add parameters or decorators from an addon.

For example, the Backgrounds preset contains the following code:

```js
// preset.js
export function config(entry = []) {
  return [...entry, require.resolve('./defaultParameters')];
}
```

Which in turn invokes:

```js
// defaultParameters.js
export const parameters = {
  backgrounds: {
    values: [
      { name: 'light', value: '#F8F8F8' },
      { name: 'dark', value: '#333333' },
    ],
  },
};
```

This is equivalent to exporting the `backgrounds` parameter manually in `main.js`.

### Addons

For users, the name `managerEntries` might be a bit too technical, so instead both users and preset-authors can simply use the property: `addons`:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-register-storysource-example.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

The array of values can support both references to other presets and addons that should be included into the manager.

Storybook will automatically detect whether a reference to an addon is a preset or a manager entry by checking if the package contains a `./preset.js` or `./register.js` (manager entry), falling back to preset if it is unsure.

If this heuristic is incorrect for an addon you are using, you can explicitly opt in to an entry being an a manager entry using the `managerEntries` key.

Here's what it looks when combining presets and managerEntries in the addons property:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-register-presets-managerentry.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Entries

Entries are the place to register entry points for the preview. For example it could be used to make a basic configure-storybook preset that loads all the `*.stories.js` files into SB, instead of forcing people to copy-paste the same thing everywhere.

## Advanced Configuration

The presets API is also more powerful than the [standard configuration options](../configure/webpack.md#extending-storybooks-webpack-config) available in Storybook, so it's also possible to use presets for more advanced configuration without actually publishing a preset yourself.

For example, some users want to configure the webpack for Storybook's UI and addons ([issue](https://github.com/storybookjs/storybook/issues/4995)), but this is not possible using [standard webpack configuration](../configure/webpack.md#default-configuration) (it used to be possible before SB4.1). However, you can achieve this with a private preset.

If it doesn't exist yet, create a file `.storybook/main.js`:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-advanced-config-example.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Sharing advanced configuration

Change your `main.js` file to:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-import-preset-config.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

and extract the configuration to a new file `./storybook/my-preset.js`:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preset-full-config-object.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->


Place your `my-preset.js` file wherever you want, if you want to share it far and wide you'll want to make it its own package.
