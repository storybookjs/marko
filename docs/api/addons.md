---
title: 'Addons'
---

Addons extend Storybook with features and integrations that are not built into the core. Most Storybook features are implemented as addons. For instance: documentation, accessibility testing, interactive controls, and design previews.
The addon API makes it easy for you to configure and customize Storybook in new ways. There are countless addons made by the community that unlock time-saving workflows. What addons can do:

- [Add a panel to Storybook (like Action Logger).](../essentials/actions.md)
- [Add a tool to Storybook’s toolbar (like zoom or grid).](../essentials/toolbars-and-globals.md)
- [Add a tab to Storybook (like SB Docs).](../writing-docs/introduction.md)

Browse the [Addon gallery](/addons) to install an existing addon or as inspiration for your own addon. Read on to learn how to make an addon yourself.

## Storybook basics

Before writing your first addon, let’s take a look at the basics of Storybook’s architecture. While Storybook presents a unified user interface, under the hood it’s divided down the middle into **Manager** and **Preview**.

The Manager is the UI where Storybook’s search, navigation, toolbars, and addons are rendered. The Preview area is an iframe where stories are rendered.

![Storybook detailed window](./manager-preview.jpg)

Because Manager and Preview run in separate iframes, they communicate across a communication channel. When you select a story within the Manager an event is sent across the channel and the selected story is rendered inside the Preview.

Many of the addon APIs you’ll read about below are abstractions to help make this communication transparent.

## Getting started

Let’s write a simple addon for Storybook which:

- Adds a new “My Addon” panel
- Retrieves a custom “myAddon” parameter from stories
- Displays the parameter data in the panel

### Add story parameters

Let’s start by writing a story for our addon that exposes a custom parameter. The idea is that our addon will show this parameter in the addon panel.

```js
// Button.story.js

import React from 'react';
import Button from './Button';
export default {
  title: 'Button',
  parameters: {
    myAddon: {
      data: 'this data is passed to the addon',
    },
  },
};
export const Basic = () => <Button>hello</Button>;
```

Because we added the story at the component level, the `myAddon` parameter is associated with all stories defined in the file.

### Add a panel

Now let’s add a panel to Storybook in a file called `register.js`, which is the entry point for addons to register themselves.

```js
// .storybook/register.js

import React from 'react';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';

const ADDON_ID = 'myaddon';
const PANEL_ID = `${ADDON_ID}/panel`;

const MyPanel = () => <div>MyAddon</div>;
addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'My Addon',
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <MyPanel />
      </AddonPanel>
    ),
  });
});
```

This is boilerplate code for any addon that adds a panel to Storybook, and there’s really not much going on here. In this case, we’re just adding a static div that renders when the panel is selected in Storybook’s UI.

### Display story parameter

Next, let’s replace the `MyPanel` component from above to show the parameter.

```js
// .storybook/register.js

import { useParameter } from '@storybook/api';
const PARAM_KEY = 'myAddon';
const MyPanel = () => {
  const value = useParameter(PARAM_KEY, null);
  const item = value ? value.data : '';
  return <div>{item}</div>;
};
```

The new version is made smarter by `useParameter`, which is a [React hook](https://reactjs.org/docs/hooks-intro.html) that updates the parameter value and re-renders the panel every time the story changes.

The addon API provides hooks like this so all of that communication can happen behind the scenes. That means you can focus on your addon's functionality.

### Register the addon

Finally, let’s hook it all up. Addons are typically published as standalone packages, but they can also be written locally in an existing Storybook project. We’ll make our addon a local addon.

Update your [`.storybook/main.js`](../configure/overview.md#configure-story-rendering):

```js
// .storybook/main.js

module.exports = {
  addons: ['path/to/register.js'],
};
```

The path can be an absolute location on your file system, or a path relative to your `.storybook` directory (e.g. `./my-addon/register.js` if you defined the addon inside your `.storybook` folder).

If you get an error similar to:

```sh
ModuleParseError: Module parse failed: Unexpected token (92:22)

You may need an appropriate loader to handle this file type.
       var value = this.state.value;
      var active = this.props.active;
      return active ? <div>{value}</div> : null;
     }
   }]);
```

It is likely because you do not have a `.babelrc` file or do not have it configured with the correct presets:

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

Now restart/rebuild Storybook and your addon should appear in the addons panel. Furthermore, as you navigate between stories, the parameter displayed should update accordingly.

### Next steps

In the previous example, we introduced the structure of an addon, but barely scratched the surface of what addons can do.

To dive deeper we recommend [Learn Storybook’s “creating addons”](https://www.learnstorybook.com/intro-to-storybook/react/en/creating-addons/) tutorial. It’s an excellent walkthrough that covers the same ground as the above introduction, but goes further and leads you through the full process of creating a realistic addon.

## Addon recipes

Once you understand the basics of writing an addons, there are a variety of common enhancements to make your addon better.

### Disabling the addon panel

It’s possible to disable the addon panel for a particular story.

To make that possible, you need to pass the `paramKey` element when you register the panel:

```js
// .storybook/register.js

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'My Addon',
    render: () => <div>Addon tab content</div>,
    paramKey: 'myAddon', // this element
  });
});
```

Then when adding a story, you can then pass a disabled parameter.

```js
// Button.story.js

import React from 'react';
export default {
  title: 'Button',
  parameters: {
    myAddon: { disable: true },
  },
};
```

### Styling your addon

Storybook uses [Emotion](https://emotion.sh/docs/introduction) for styling, AND we provide a theme which can be set by the user!

We recommend you also use Emotion to style your addon’s UI components. That allows you to use the active Storybook theme to deliver a seamless developer experience.
If you don’t want to use Emotion, you can use inline styles or another css-in-js lib. You can receive the theme as a prop by using the `withTheme` hoc from Emotion. [Read more about theming](../configure/theming.md).

### Storybook components

Addon authors can develop their UIs using any React library. But we recommend using Storybook’s own UI components in `@storybook/components` to build addons faster. When you use Storybook components you get:

- Battled tested off-the-shelf components
- Storybook native look and feel
- Built-in support for Storybook theming

You can check them out in [Storybook’s own storybook](https://storybookjs.netlify.app/)

### Packaging

In the example above, we showed how to write a local addon inside an existing Storybook project. To distribute your addon for others, package the addon into a standalone NPM module.

For a good template of an addon packaged as an NPM module, check out [@storybook/addon-controls].

It contains addon code similar to what we’ve written above. It also contains:

- A package.json file that declares the module
- Peer dependencies of `react` and `@storybook/addons`
  -A `register.js` file at the root level written as an ES5 modules
- A `src` directory containing the ES6 addon code
- A `dist` directory containing transpiled ES5 code on publish

Your packaged Storybook addon needs to be written in ES5. If you are using ES6, then you need to transpile it.

When you are developing your addon as a package, you can’t use npm link to add it to your project. Instead add your package as a local dependency into your package.json:

```json
{
  "dependencies": {
    "@storybook/addon-controls": "file:///home/username/myrepo"
  }
}
```

## Addon presets

Storybook presets are collections of Storybook configurations that get applied automatically when you create a `/preset.js` entry point in your addon and then list that addon in your project’s [`.storybook/main.js`](../configure/overview.md#configure-story-rendering) addons field.

Common uses for presets include:

- Register an addon’s `register.js`.
- Set global parameters for the addon (e.g. [addon-backgrounds](https://github.com/storybookjs/storybook/tree/next/addons/backgrounds)).
- Add global decorators for the addon (e.g. [addon-a11y](https://github.com/storybookjs/storybook/tree/next/addons/a11y)).
- Set up webpack customizations for the addon (e.g. [addon-docs](../writing-docs/introduction.md)).

Here’s an example of typical preset file:

```js
//preset.js
export function config(entry = []) {
  return [...entry, require.resolve('./defaultParameters')];
}

export function managerEntries(entries) {
  return [...entries, require.resolve('./register')];
}

export const parameters = {
  backgrounds: {
    values: [
      { name: 'light', value: '#F8F8F8' },
      { name: 'dark', value: '#333333' },
    ],
  },
};
```

For more information on presets, see the [presets docs](./presets.md).

## Writing presets

If you want to learn more how you can write your own presets, read the [documentation](./writing-presets.md)

## Addons API

If you want to expand your knowledge on the Addons API, read the [documentation](./addons-api.md)
