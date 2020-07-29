---
title: 'Overview'
---

Storybook is configured via a folder, called `.storybook` which contains various configuration files. 

> Note you can change the folder that Storybook uses by setting the `-c` flag to your `start-storybook` and `build-storybook` scripts.


### Configure your Storybook project

The main configuration file is `main.js`. This file controls the behaviour of the Storybook server, and so you must restart Storybook’s process when you change it. It contains the following:

```js
// .storybook/main.js

module.exports = {
  stories: ['../src/**/*.stories.(js|mdx)'],
  addons: ['@storybook/addon-essentials']
}
```

The `main.js` configuration file is a [preset](../api/addons#addon-presets) and as such has a powerful interface, but the key fields within it are:

- `stories` - a array of globs that indicates the [location of your story files](#configure-story-loading), relative to `main.js`.
- `addons` - a list of the [addons](/addons) you are using.
- `webpackFinal` - custom [webpack configuration](./integration#extending-storybooks-webpack-config).
- `babel` - custom [babel configuration](./integration#babel).

### Configure story loading

By default, Storybook will load stories from your project based on a glob (pattern matching string) in `.storybook/main.js` that matches all files in your project with extension `.stories.js`. The intention is you colocate a story file with the component it documents.

```
•
└── components
        ├── Button.js
        └── Button.stories.js
```

If you want to use a different naming convention, you can alter the glob, using the syntax supported by [micromatch](https://github.com/micromatch/micromatch#extended-globbing).

For example if you wanted to pull both `.md` and `.js` files from the `my-project/src/components` directory, you could write:

```js
// .storybook/main.js

module.exports = {
  stories: ['../my-project/src/components/*.@(js|md)'],
};
```

### Configure story rendering

To control the way stories are rendered and add global [decorators](../writing-stories/decorators#global-decorators) and [parameters](..writing-stories/parameters#global-parameters), create a  `.storybook/preview.js` file. This is loaded in the Canvas tab, the “preview” iframe that renders your components in isolation. Use `preview.js` for global code (such as [CSS imports](../get-started/setup#render-component-styles) or JavaScript mocks) that applies to all stories.

The `preview.js` file can be an ES module and export the following keys: 

- `decorators` - an array of global [decorators](../writing-stories/decorators#global-decorators)
- `parameters` - an object of global [parameters](..writing-stories/parameters#global-parameters)
- `globalTypes` - definition of [globalTypes](../essentials/toolbars-and-globals#global-types-and-the-toolbar-annotation)

If you’re looking to change how your stories are ordered, read about [sorting stories](../writing-stories/naming-components-and-hierarchy#sorting-stories).

### Configure Storybook’s UI

To control the behaviour of Storybook’s UI (the **“manager”**), you can create a `.storybook/manager.js` file.

This file does not have a specific API but is the place to set [UI options](./user-interface) and to configure Storybook’s [theme](./user-interface#theming).
