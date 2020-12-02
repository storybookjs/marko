---
title: Set up Storybook addons
---

Storybook boasts a wide variety of addons in it's ecosystem. All of them packaged as NPM modules and listed in our [addon gallery](/addons). We're going to guide you through the necessary steps to install and register Storybook addons.

### Install Storybook addons

With the exception of presets, all other Storybook addons follow the same set of installation instructions. For example, to include accessibility testing in Storybook, run the following command to install the necessary addon:

```shell
yarn add -D @storybook/addon-a11y
```

### Addon registration

Installing the addon is not enough, it needs to be registered. Update [`.storybook/main.js`](../configure/overview.md#configure-story-rendering) to the following:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-addon-registration.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">
Other addons like the one mentioned might require additional configurations. Check the addon README for additional configuration requirements.
</div>

That's it, when Storybook starts up accessibility testing is enabled.

![Storybook addon installed and registered](./storybook-addon-installed-registered.png)


### Install Storybook presets

Storybook presets are grouped collections of specific `babel`, `webpack` and `addons` configurations for distinct use cases. Each preset follows its installation instructions, but the general idea behind presets is to install an addon and then load its preset.

For example, to use SCSS styling, first install the preset and the required dependencies:

```sh
yarn add -D @storybook/preset-scss css-loader sass-loader style-loader
```

### Preset registration

Installing the preset and the required dependencies is not enough, as with the example above presets also need to be registered. Update [`.storybook/main.js`](../configure/overview.md#configure-story-rendering) to the following:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-preset-config.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

When Storybook starts up, it will configure itself to use SCSS styling without any further configuration.

## Presets configuration

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

<div class="aside">
Each preset has its own options and those should be documented in their README.
</div>

<!-- Each preset available in the Storybook ecosystem has it's own installation instructions, but the idea of presets is to install a addon like detailed above and then load it's preset.

As an example  -->