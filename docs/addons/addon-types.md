---
title: 'Types of addons'
---

Each Storybook addon is classified into two general categories, UI-based or Presets. Documented here are some of the features available for each type of addon. Use it as a reference when creating your next Storybook addon.

## UI-based addons

This particular type of addons allows you to customize Storybook's UI. If the addon you're developing falls into this category you can use some of the following elements to further customize the interface.

### Panels

This type of UI element allows you to add your own custom <code>Panel</code> to Storybook's UI. Currently the most common use case available throughout our ecosystem. Good examples that use this type of interface are: [@storybook/actions](../essentials/actions.md) and [@storybook/a11y](https://github.com/storybookjs/storybook/tree/next/addons/a11y).

Below is the boilerplate code that you can use in your own addon to add a `Panel` in Storybook's UI.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-addon-panel-example.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->


### Toolbars

This type of UI element allows you to add <code>Toolbars</code> to Storybook's UI. Good examples that use this type of interface are: [@storybook/backgrounds](../essentials/backgrounds.md) and [storybook-addon-outline](https://github.com/chromaui/storybook-outline).

Below is the boilerplate code that you can use in your own addon to add a new `Toolbar` in Storybook's UI.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-addon-toolbar-example.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->


### Tabs

This type of UI element allows you to add your own custom <code>Tabs</code> to Storybook's UI. A good example that use this type of interface is the: [@storybook/addon-docs](../writing-docs/introduction.md).

Below is the boilerplate code that you can use in your own addon to add a new `Tab` in Storybook's UI.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-addon-tab-example.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->


<div class="aside">
If want to learn more about writing your own addon and include some of these elements, read our <a href="./writing-addons">documentation</a>.
</div>

## Presets

Storybook presets are grouped collections of `babel`, `webpack`, and `addons` configurations that support specific use cases for your addon. Good examples of presets are [preset-scss](https://github.com/storybookjs/presets/tree/master/packages/preset-scss) and [preset-create-react-app](https://github.com/storybookjs/presets/tree/master/packages/preset-create-react-app) maintained by Storybook.

Below is a boilerplate code that you can use while writing your own preset.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preset-full-config-object.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">
If you want to learn more about writing your own preset, read our <a href="./writing-presets">documentation</a>
</div>