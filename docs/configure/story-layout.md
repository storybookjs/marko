---
title: 'Story layout'
---

The `layout`[global parameter](../writing-stories/parameters.md) is a way to configure how stories are rendered in Storybook's UI. 

You can add the parameter to your [`./storybook/preview.js`](./overview.md#configure-story-rendering), like so:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-layout-param.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

With the example above, Storybook will center all stories in the UI. Asides from `centered` you can also use:

- `fullscreen`, to emulate a fullscreen environment.
- `padded`, for some extra padding.

If you need to use your own styles, or use a more granular approach we recommend using [decorators](../writing-stories/decorators.md) instead.