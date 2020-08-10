---
title: 'Essential addons'
---

A major strength of Storybook are [addons](/addons/) that extend Storybook’s UI and behavior. There are many third-party addons as well as “official” addons developed by the Storybook core team. Storybook ships by default with a set of “essential” addons that add to the initial user experience.

- [Docs](../writing-docs/introduction.md)
- [Controls](./controls.md)
- [Actions](./actions.md)
- [Viewport](./viewports.md)
- [Backgrounds](./backgrounds.md)
- [Toolbars](./toolbars.md)

### Configuration

Essentials is "zero config”, it comes with a recommended configuration out of the box.

If you need to reconfigure any of the essential addons, install it manually, following the installation instructions and adjust the configuration to your needs.

When you start Storybook, Essentials will override its configuration with your own.

### Disabling addons

If you need to disable any of the Essential's addons, you can do it by changing your [`.storybook/main.js`](../configure/overview.md#configure-story-rendering) file.

As an example, if the background addon wasn't necessary to your work, you would need to make the following change:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-disable-addon.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

You can use the following keys for each individual addon: `actions`, `backgrounds`, `controls`, `docs`, `viewport`, `toolbars`.

</div>
