
---
id: 'overview'
title: 'Configuration overview'
---

For CLI options see: [here](/docs/cli-options).

> migration guide: This page documents the method to configure storybook introduced recently in 5.3.0, consult the [migration guide](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md) if you want to migrate to this format of configuring storybook.

## main configuration

Storybook has a few files it uses for configuration, and they are grouped together into a directory (default: `.storybook`).

The most import file is the `main.js` file. This is where general config is declared.

Here's an minimal example of a that file:

```js
module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/addon-essentials',
  ],
};
```

The addons field can refer to traditional [addons](docs/addons/introduction), but it can also include [presets](/docs/presets/introduction/) extending the config further.

## manager & preview

Storybook works by being split into 2 applications, which communicate with each other over a postmessage channel; called the "manager" and "preview".

The preview application is essentially just your stories with a framework agnostic 'router'. Making it so when the manager application tells it so, it renders the correct story.

The manager application renders the UI of [addons](docs/addons/introduction), the navigator and [toolbar](/docs/basics/toolbar-guide/).

There are 2 extra config files, for doing some special runtime configs for each of those 2 applications.

In `preview.js` you can add global [decorators](../../basics/writing-stories/#decorators) and [parameters](../../basics/writing-stories/#parameters):

```js
// preview.js
import { addDecorator } from '@storybook/svelte';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
```

In `manager.js` you can add [UI options](/docs/configurations/options-parameter/#global-options).

```js
// manager.js
import { themes } from '@storybook/theming/create';
import { addons } from '@storybook/addons';

addons.setConfig({
  theme: themes.dark,
});
```

## entire main.js config

The `main.js` file is actually a preset! so if you know how to configure storybook, you know how to write a preset, and vice-versa!
So the API of `main.js` is equal to [that of presets](/docs/presets/writing-presets/#presets-api).

Here's an overview of the important configuration properties in `main.js`:

```js
module.exports = {
  // and array of glob patterns
  stories: ['../src/components/**/*.stories.js'],

  // an array of addons & presets
  addons: ['@storybook/addon-essentials'],
};
```

## webpack

For how to customize webpack, [view the customize webpack section](/docs/configurations/custom-webpack-config/)