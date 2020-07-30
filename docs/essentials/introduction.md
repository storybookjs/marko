---
title: 'Introduction'
---

A major strength of Storybook are [addons](/addons/) that extend Storybook’s UI and behaviour. There are many third-party addons as well as “official” addons developed by the Storybook core team. Storybook ships by default with a set of “essential” addons that add to the initial user experience.

- [Actions](./actions)
- [Backgrounds](./backgrounds)
- [Controls](./controls)
- [Docs](../writing-docs/introduction)
- [Viewport](./viewports)

### Configuration

Essentials is "zero config”, it comes with a recommended configuration out of the box.

If you need to reconfigure any of the essential addons, install it manually, following the installation instructions and adjust the configuration to your needs.

When you start Storybook, Essentials will override its configuration with your own.

### Disabling addons

If you need to disable any of the Essential's addons, you can do it by changing your [`.storybook/main.js`](../configure/overview#configure-story-rendering) file.

As an example, if the background addon wasn't necessary to your work, you would need to make the following change:

```js
// .storybook/main.js

module.exports = {
  addons: [{
    name: '@storybook/addon-essentials',
    options: {
      backgrounds: false,
    }
  }]
};
```

You can use the following keys for each individual addon: `actions`, `backgrounds`, `controls`, `docs`, `viewport`
