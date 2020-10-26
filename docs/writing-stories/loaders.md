---
title: 'Loaders'
---

Loaders are asynchronous functions that load data for a story and its [decorators](./decorators.md). A story's loaders run before the story renders, and the loaded data is passed into the story via its render context.

Loaders can be used to load any asset (e.g. lazy-loaded components), but they are are typically used to fetch remote API data to be used in a story.

> NOTE: [Args](./args.md) are the recommended way to manage story data, and we're building up an ecosystem of tools and techniques around them. Loaders are an advanced feature ("escape hatch") and we only recommend using them if you have a specific need that can't be fulfilled by other means.

## Fetching API data

Stories are isolated component examples that render internal data that's defined as part of the story or alongside the story as [args](./args.md).

Loaders are useful when you need to load story data externally, e.g. from a remote API. Consider the following example that fetches a todo item for display in a todo list:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/loader-story.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

The loaded data is combined into a `loaded` field on the story context, which is the second argument to a story function. In this example we spread the story's args in first, so they take priority over the static data provided by the loader.

## Global loaders

We can also set a loader for **all stories** via the `loaders` export of your [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering) file (this is the file where you configure all stories):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/storybook-preview-global-loader.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

In this example, we load a "current user" that is available as `loaded.currentUser` for all stories.

## Loader inheritance

Like parameters, loaders can be defined globally, at the component level and for a single story (as we’ve seen).

All loaders, defined at all levels that apply to a story, run before the story is rendered.

- All loaders run in parallel
- All results are the `loaded` field in the story context
- If there are keys that overlap, "later" loaders take precedence (from lowest to highest):
  - Global loaders, in the order they are defined
  - Component loaders, in the order they are defined
  - Story loaders, in the order they are defined

## Known limitations

Loaders have the following known limitations:

- They are not yet compatible with the storyshots addon ([#12703](https://github.com/storybookjs/storybook/issues/12703)).
- They are not yet compatible with inline-rendered stories in Storybook Docs ([#12726](https://github.com/storybookjs/storybook/issues/12726)).
