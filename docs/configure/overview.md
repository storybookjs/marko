---
title: 'Configure Storybook'
---

Storybook is configured via a folder, called `.storybook` which contains various configuration files.

<div class="aside">

Note you can change the folder that Storybook uses by setting the `-c` flag to your `start-storybook` and `build-storybook` scripts.

</div>

## Configure your Storybook project

The main configuration file is `main.js`. This file controls the behaviour of the Storybook server, and so you must restart Storybook’s process when you change it. It contains the following:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-default-setup.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

The `main.js` configuration file is a [preset](../api/presets.md) and as such has a powerful interface, but the key fields within it are:

- `stories` - an array of globs that indicates the [location of your story files](#configure-story-loading), relative to `main.js`.
- `addons` - a list of the [addons](/addons) you are using.
- `webpackFinal` - custom [webpack configuration](./webpack.md#extending-storybooks-webpack-config).
- `babel` - custom [babel configuration](./babel.md).

## Configure story loading

By default, Storybook will load stories from your project based on a glob (pattern matching string) in `.storybook/main.js` that matches all files in your project with extension `.stories.js`. The intention is you colocate a story file with the component it documents.

```
•
└── components
        ├── Button.js
        └── Button.stories.js
```

If you want to use a different naming convention, you can alter the glob, using the syntax supported by [micromatch](https://github.com/micromatch/micromatch#extended-globbing).

For example if you wanted to pull both `.md` and `.js` files from the `my-project/src/components` directory, you could write:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-js-md-files.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Configure story rendering

To control the way stories are rendered and add global [decorators](../writing-stories/decorators.md#global-decorators) and [parameters](../writing-stories/parameters.md#global-parameters), create a `.storybook/preview.js` file. This is loaded in the Canvas tab, the “preview” iframe that renders your components in isolation. Use `preview.js` for global code (such as [CSS imports](../get-started/setup.md#render-component-styles) or JavaScript mocks) that applies to all stories.

The `preview.js` file can be an ES module and export the following keys:

- `decorators` - an array of global [decorators](../writing-stories/decorators.md#global-decorators)
- `parameters` - an object of global [parameters](../writing-stories/parameters.md#global-parameters)
- `globalTypes` - definition of [globalTypes](../essentials/toolbars-and-globals.md#global-types-and-the-toolbar-annotation)

If you’re looking to change how your stories are ordered, read about [sorting stories](../writing-stories/naming-components-and-hierarchy.md#sorting-stories).

## Configure Storybook’s UI

To control the behaviour of Storybook’s UI (the **“manager”**), you can create a `.storybook/manager.js` file.

This file does not have a specific API but is the place to set [UI options](./features-and-behavior.md) and to configure Storybook’s [theme](./theming.md).
