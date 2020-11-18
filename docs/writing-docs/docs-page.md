---
title: 'DocsPage'
---

When you install [Storybook Docs](https://github.com/storybookjs/storybook/blob/master/addons/docs/README.md), DocsPage is the zero-config default documentation that all stories get out of the box. It aggregates your stories, text descriptions, docgen comments, args tables, and code examples into a single page for each component.

The best practice for docs is for each component to have its own set of documentation and stories.

## Component parameter

Storybook uses the `component` key in the story file’s default export to extract the component's description and props.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/my-component-story.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Subcomponents parameter

Sometimes it's useful to document multiple components together. For example, a component library’s ButtonGroup and Button components might not make sense without one another.

DocsPage has the concept of a "primary" component that is defined by the `component` parameter. It also accepts one or more `subcomponents`.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-group-story-subcomponents.js.mdx',
    'common/button-group-story-subcomponents.ts.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

![Subcomponents in Docs Page](./docspage-subcomponents.png)

Subcomponent `ArgsTables` will show up in a tabbed interface along with the primary component. The tab titles will correspond to the keys of the subcomponents object.

If you want to organize your documentation differently for component groups, we recommend using MDX. It gives you complete control over display and supports any configuration.

## Replacing DocsPage

Replace DocsPage template with your own for the entire Storybook, a specific component, or a specific story.

Override the `docs.page` [parameter](../writing-stories/parameters.md):

- With null to remove docs.
- With MDX docs.
- With a custom component

### Story-level

Override the `docs.page` [parameter](../writing-stories/parameters.md#story-parameters) in the story definition.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-disable-docspage.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Component-level

Override the `docs.page` [parameter](../writing-stories/parameters.md#component-parameters) in the default export of the story file.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-disable-docspage-component.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Global-level

Override the `docs.page` [parameter](../writing-stories/parameters.md#global-parameters) in [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering).

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-disable-docspage.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Remixing DocsPage using doc blocks

Doc blocks are the basic building blocks of Storybook Docs. DocsPage composes them to provide a reasonable UI documentation experience out of the box.

If you want to make minor customizations to the default DocsPage but don’t want to write your own MDX you can remix DocsPage. That allows you to reorder, add, or omit doc blocks without losing Storybook’s automatic docgen capabilities.

Here's an example of rebuilding DocsPage for the Button component using doc blocks:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-remix-docspage.js.mdx',
    'common/button-story-remix-docspage.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Apply a similar technique to remix the DocsPage at the [story](#story-level), [component](#component-level), or [global](#global-level) level.

In addition, you can interleave your own components to customize the auto-generated contents of the page, or pass in different options to the blocks to customize their appearance. Read more about [Doc Blocks](./doc-blocks.md).

## Story file names

Unless you use a custom [webpack configuration](../configure/webpack.md#extending-storybooks-webpack-config), all of your story files should have the suffix `*.stories.@(j|t)sx?`. For example, "Badge.stories.js" or "Badge.stories.tsx". This tells Storybook and its docs preset to display the docs based on the file contents.

## Inline stories vs. iframe stories

DocsPage displays all the stories of a component in one page. You have the option of rendering those stories inline or in an iframe.

By default, we render React and Vue stories inline. Stories from other supported frameworks will render in an `<iframe>` by default.

The iframe creates a clean separation between your code and Storybook’s UI. But using an iframe has disadvantages. You have to explicitly set the height of iframe stories or you’ll see a scroll bar. And certain dev tools might not work right.

Render your framework’s stories inline using two docs configuration options in tandem, `inlineStories` and `prepareForInline`.

Setting `inlineStories` to `true` tells Storybook to stop putting your stories in an iframe. The `prepareForInline` accepts a function that transforms story content from your given framework to something React can render (Storybook’s UI is built in React).

Different frameworks will need to approach this in different ways. Angular, for example, might convert its story content into a custom element (you can read about that [here](https://angular.io/guide/elements)).

Here’s an example of how to render Vue stories inline. The following docs config block uses `prepareForInline` along with an effect hook provided by [@egoist/vue-to-react](https://github.com/egoist/vue-to-react).

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-prepareforinline.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

With this function, anyone using the docs addon for [@storybook/vue](https://github.com/storybookjs/storybook/tree/master/app/vue) can make their stories render inline, either globally with the inlineStories docs parameter, or on a per-story-basis using the inline prop on the `<Story>` doc block.

If you come up with an elegant and flexible implementation for the `prepareForInline` function for your own framework, let us know. We'd love to make it the default configuration to make inline stories more accessible for a larger variety of frameworks!
