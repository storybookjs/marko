---
title: 'Configure and communicate with an addon'
---

Storybook is designed to be highly customizable. You can develop all kinds of workflows around it. To support this, you can allow users to configure and communicate with addons in several different ways.

## Preset

Preset options are global and are accessible from NodeJS. Great for things like Webpack loaders, Babel plugins, and other library or framework-specific configurations.

Presets offload the burden of configuration from the user to the addon. They are convenient for integrating libraries with Storybook. Let's look at an example.

Many libraries require that the app be wrapped by a `Provider`. Which then provides data to components down the tree. For example, CSS-in-JS libraries use a `ThemeProvider` to access the app's theme. Presets can describe behavior like adding wrappers automatically, without users having to do any manual configuration. If a user installs an addon that has Presets, the addon can instruct Storybook to wrap all stories in `ThemeProvider`. This allows folks to start using your library with Storybook, with just 1 line of config!

For more on presets, see: [Write a preset addon](./writing-presets)

The mechanism for wrapping each story is referred to as [decorators](../writing-stories/decorators) in Storybook. They allow you to augment stories with extra rendering functionality or by providing data.

## Parameters

Parameters are available in the browser and are great for configuring addon behaviour globally, at the component level, or at the story level.

For example, the [Pseudo States addon](https://storybook.js.org/addons/storybook-addon-pseudo-states) uses parameters to enable the various pseudo-states. Users can provide global defaults and then override them at the story level.

Use the [`useParameter`](./addons-api#useparameter) hook to access the parameter values within your addon.

```js
export const Hover = () => <Button>Label</Button>;
Hover.parameters = { pseudo: { hover: true } };
```

## Channels

Channels enable two-way communication between the manager and the preview pane, using a NodeJS [EventEmitter](https://nodejs.org/api/events.html) compatible API. Your addons can plug into specific channels and respond to these events.

For example, the [Actions addon](https://storybook.js.org/addons/@storybook/addon-actions) captures user events and displays their data in a panel.

Use the [`useChannel`](./addons-api#usechannel) hook to access the channel data within your addon.

For a complete example, check out [storybookjs/addon-kit/withRoundTrip.js](https://github.com/storybookjs/addon-kit/blob/main/src/withRoundTrip.js)
