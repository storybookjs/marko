---
title: 'Introduction to Storybook addons'
---

Addons extend Storybook with features and integrations that are not built into the core. Most Storybook features are implemented as addons. For instance: [documentation](../writing-docs/introduction.md), [accessibility testing](https://github.com/storybookjs/storybook/tree/master/addons/a11y), [interactive controls](../essentials/controls.md), among others.
The [addon API](./addons-api.md) makes it easy for you to configure and customize Storybook in new ways. There are countless addons made by the community that unlock time-saving workflows.

Browse our [addon catalog](/addons) to install an existing addon or as inspiration for your own addon.

## Storybook basics

Before writing your first addon, let’s take a look at the basics of Storybook’s architecture. While Storybook presents a unified user interface, under the hood it’s divided down the middle into **Manager** and **Preview**.

The **Manager** is the UI responsible for rendering the:

- 🔍 Search
- 🧭 Navigation
- 🔗 Toolbars
- 📦 Addons 

The **Preview** area is an `iframe` where your stories are rendered.

![Storybook detailed window](./manager-preview.jpg)

Because both elements run in their own separate `iframes`, they use a communication channel to keep in synch. For example when you select a story in the Manager a event is dispatched across the channel notifying the Preview to render the story.

### Anatomy of an addon

Storybook addons allow you to extend what's already possible with Storybook, everything from the [interface](./addon-types.md) to the [API](./addons-api.md). Each one classified into two broader categories.

#### UI-based addons

This particular type of addons focuses mainly on the interface. Installing addons that fall into this category help you with your existing workflows. Good examples of this particular type are: [Controls](../essentials/controls.md), [Docs](../writing-docs/introduction.md) or the [Accessibility addon](https://github.com/storybookjs/storybook/tree/master/addons/a11y).

<div class="aside">
Read our <a href="./writing-addons">documentation</a> to learn more about creating addons.
</div>

#### Preset addons

This particular type of addons focuses on integrations. They are often used to integrate Storybook with other existing technologies. Good examples of this particular type are: [preset-scss](https://github.com/storybookjs/presets/tree/master/packages/preset-scss) and [preset-create-react-app](https://github.com/storybookjs/presets/tree/master/packages/preset-create-react-app).

<div class="aside">
Read our <a href="./writing-presets">documentation</a> to learn more about preset addons.
</div>
