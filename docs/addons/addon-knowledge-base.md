---
title: Addons knowledge base
---

Once you understand the basics of writing addons, there are a variety of common enhancements to make your addon better. This page details additional information about addon creation. Use it as a quick reference guide when creating your own addons. 

### Disabling the addon panel

It’s possible to disable the addon panel for a particular story.

To make that possible, you need to pass the `paramKey` element when you register the panel:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-addon-disable-addon.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Then when adding a story, you can pass a disabled parameter.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/button-story-disable-addon.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Styling your addon

Storybook uses [Emotion](https://emotion.sh/docs/introduction) for styling. Alongside with a theme which you can customize!

We recommend you also to use Emotion to style your addon’s UI components. That allows you to use the active Storybook theme to deliver a seamless developer experience.
If you don’t want to use Emotion, you can use inline styles or another css-in-js lib. You can receive the theme as a prop by using the `withTheme` hoc from Emotion. [Read more about theming](../configure/theming.md).

### Storybook components

Addon authors can develop their UIs using any React library. But we recommend using Storybook’s own UI components in `@storybook/components` to build addons faster. When you use Storybook components you get:

- Battle-tested off-the-shelf components
- Storybook native look and feel
- Built-in support for Storybook theming

You can check them out in [Storybook’s own storybook](https://storybookjs.netlify.app/)

### Build system

When you are developing your addon as a package, you can’t use `npm link` to add it to your project. List  your addon as a local dependency into your package.json:

```json
{
  "dependencies": {
    "@storybook/addon-controls": "file:///home/username/myrepo"
  }
}
```

<div class="aside">
Run either <code>yarn</code> or <code>npm install</code> to install the addon.
</div>

### Hot module reload

While developing your addon you can configure HMR (hot module replacement ) to reflect the changes made. 

#### Standalone Storybook addons

If you're developing a standalone addon, add a new script to `package.json` with the following: 

```json
{
  "scripts":{
    "start": "npm run build -- --watch",
  }
}
```

#### Local Storybook addons

If you're developing a local Storybook addon (an addon built on top of a existing Storybook installation) HMR (hot module replacement) should be available out of the box. If you don't see the changes being reflected, add the flag `--no-manager-cache` to the `storybook` script and restart Storybook.