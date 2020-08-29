---
title: 'Storybook Composition'
---

Composition allows you to embed components from any Storybook inside your local Storybook. It’s made for teams who adopt Storybook in multiple projects but can’t ensure that the projects have the same tech stack or share the same repo.

You can compose any Storybook [published online](./publish-storybook.md) or running locally no matter the view layer, tech stack, or dependencies.

![Storybook composition](./combine-storybooks.png)

## Compose published Storybooks

In your [`storybook/main.js`](../configure/overview.md#configure-story-rendering) file add a `refs` field with information about the reference Storybook. Pass in a URL to a statically built Storybook.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-ref-remote.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Compose local Storybooks

You can also compose Storybook that are running locally. For instance, if you have a React Storybook and a Angular Storybook running on different ports:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-ref-local.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

This composes the React and Angular Storybooks into your current Storybook. When either code base changes, hot-module-reload will work perfectly. That enables you to develop both frameworks in sync.
