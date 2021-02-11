---
title: 'Doc Blocks'
---

Doc Blocks are the building blocks of Storybook documentation pages. By default, [DocsPage](./docs-page.md) uses a combination of the blocks below to build a page for each of your components automatically.

Custom [addons](../addons/writing-addons.md) can also provide their own doc blocks.

## ArgsTable

Storybook Docs automatically generates component args tables for components in supported frameworks. These tables list the arguments ([args for short](../writing-stories/args.md)) of the component, and even integrate with [controls](../essentials/controls.md) to allow you to change the args of the currently rendered story.

<video autoPlay muted playsInline loop>
  <source
    src="addon-controls-docs-optimized.mp4"
    type="video/mp4"
  />
</video>

This is extremely useful, but it can be further expanded. Additional information can be added to the component to better document it:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/button-component-with-proptypes.js.mdx',
    'react/button-component-with-proptypes.ts.mdx',
    'angular/button-component-with-proptypes.ts.mdx',
    'vue/button-component-with-proptypes.vue.mdx',
    'svelte/button-component-with-proptypes.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

By including the additional information, the args table will be updated. Offering a richer experience for any stakeholders involved.

### DocsPage

To use the `ArgsTable` in [DocsPage](./docs-page.md#component-parameter), export a component property on your stories metadata:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/my-component-story.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### MDX

To use the `ArgsTable` block in MDX, add the following:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/component-story-mdx-argstable-block.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Customizing

`ArgsTables` are automatically inferred from your components and stories, but sometimes it's useful to customize the results.

`ArgsTables` are rendered from an internal data structure called [ArgTypes](../api/argtypes.md). When you declare a story's component metadata, Docs automatically extracts ArgTypes based on the component's properties.

You can customize what's shown in the `ArgsTable` by customizing the `ArgTypes` data. This is currently available for [DocsPage](./docs-page.md) and `<ArgsTable story="xxx">` construct, but not for the `<ArgsTable of={component} />` construct.

<div class="aside">

NOTE: This API is experimental and may change outside of the typical semver release cycle

</div>

The API documentation of `ArgTypes` is detailed in a [separate section](../api/argtypes.md), but to control the description and default values, use the following fields:

| Field                          |                                           Description                                            |
| :----------------------------- | :----------------------------------------------------------------------------------------------: |
| **name**                       |                                     The name of the property                                     |
| **type.required**              |                         The stories to be show, ordered by supplied name                         |
| **description**                |                             A Markdown description for the property                              |
| **table.type.summary**         |                                   A short version of the type                                    |
| **table.type.detail**          |                                    A long version of the type                                    |
| **table.defaultValue.summary** |                               A short version of the default value                               |
| **table.defaultValue.detail**  |                               A long version of the default value                                |
| **control**                    | See [addon-controls README ](https://github.com/storybookjs/storybook/tree/next/addons/controls) |

For instance:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/component-story-csf-argstable-customization.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

This would render a row with a modified description, a type display with a dropdown that shows the detail, and no control.

If you find yourself writing the same definition over and over again, Storybook provides some convenient shorthands, that help you streamline your work.

For instance you can use:

- `number`, which is shorthand for `type: {name: 'number'}`
- `radio`, which is a shorthand for `control: {type: 'radio' }`

### Grouping

One other relevant aspect of customization related to the ArgsTables is grouping.

Similar argTypes can be grouped into specific categories or even subcategories.

Looking at the following component:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/button-implementation.js.mdx',
    'react/button-implementation.ts.mdx',
    'angular/button-implementation.ts.mdx',
    'vue/button-implementation.vue.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

Similar properties could be grouped together to allow better structuring and organization.

We could use the following pattern to group them:

| Field               | Category |
| :------------------ | :------: |
| **backgroundColor** |  Colors  |
| **primary**         |  Colors  |
| **label**           |   Text   |
| **onClick**         |  Events  |
| **size**            |  Sizes   |

Which will result in the following story implementation:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-argtypes-with-categories.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

And the following change in the Storybook UI:

![button story with args grouped into categories](./button-args-grouped-categories.png)

The formula used above can be improved even further and include subcategories.

Turning the table above into:

| Field               | Category |   Subcategory   |
| :------------------ | :------: | :-------------: |
| **backgroundColor** |  Colors  |  Button colors  |
| **primary**         |  Colors  |  Button style   |
| **label**           |   Text   | Button contents |
| **onClick**         |  Events  |  Button Events  |
| **size**            |  Sizes   |                 |

Leading to the following change in the story implementation and UI:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-argtypes-with-subcategories.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

![button story with args grouped into categories](./button-args-grouped-subcategories.png)

#### MDX

To customize `argTypes` in MDX, you can set an `mdx` prop on the `Meta` or `Story` components:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/component-story-mdx-argtypes.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Controls

The controls inside an `ArgsTable` are configured in exactly the same way as the [controls](../essentials/controls.md) addon pane. In fact you’ll probably notice the table is very similar! It uses the same component and mechanism behind the scenes.

## Source

Storybook Docs displays a story’s source code using the `Source` block. The snippet has built-in syntax highlighting and can be copied with the click of a button.

![Docs blocks with source](./docblock-source.png)

### DocsPage

In DocsPage, the `Source` block appears automatically within each story’s [Canvas](#canvas) block.

To customize the source snippet that’s displayed for a story, set the `docs.source.code` and optionally the `docs.source.language` parameters:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/component-story-custom-source.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

There is also a `docs.source.type` parameter that controls how source is auto-generated. Valid values include:

| Value              | Description                                                                                                         |                   Support                    |
| :----------------- | :------------------------------------------------------------------------------------------------------------------ | :------------------------------------------: |
| **auto** (default) | Use `dynamic` snippets if the story is written using [Args](../writing-stories/args) and the framework supports it. |                     All                      |
| **dynamic**        | Dynamically generated snippet based on the output of the story function, e.g. JSX code for react.                   | [Limited](../api/frameworks-feature-support) |
| **code**           | Use the raw story source as written in the story file.                                                              |                     All                      |

As an example, if you had the following story:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/button-story-default-docs-code.js.mdx',
    'react/button-story-default-docs-code.ts.mdx',
    'vue/button-story-default-docs-code.js.mdx',
    'angular/button-story-default-docs-code.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

If you click the `Show code` button, you'll see the default behavior being applied:

![button story default behavior in docs tab](./button-story-default-docs-code.png)

To visualize the source as code, you'll need to include the code option in the `docs.source.type` [parameter](../writing-stories/parameters.md):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-docs-code-type.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

Which leads to the following change in the `code` shown in the `Docs` tab:

<video autoPlay muted playsInline loop>
  <source
    src="button-story-code-doc-type-optimized.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">

The pattern described will be applied to all the stories for the component. If you need, you can apply this to individual stories for more granular cases. Read more about story-level parameters [here](../writing-stories/parameters.md#story-parameters).

</div>

### MDX

You can also use the `Source` block in MDX. It accepts either a story ID or `code` snippet. Use the `language` for syntax highlighting. It supports the following languages: `javascript`, `jsx`, `json`, `yml`, ,`md`, `bash`, `css`, `html`, `tsx`, `typescript`, `graphql`.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/component-story-mdx-dedent.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Description

Storybook Docs shows a component’s description extracted from the source code or based on a user-provided string.

![Docs blocks with description](./docblock-description.png)

### DocsPage

In DocsPage, a component’s description is shown at the top of the page. For [supported frameworks](https://github.com/storybookjs/storybook/tree/next/addons/docs#framework-support), the component description is automatically extracted from a docgen component above the component in its source code. It can also be set by the `docs.description` parameter.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/component-story-csf-description.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### MDX

In MDX, the `Description` shows the component’s description using the same heuristics as the DocsPage. It also accepts a `markdown` parameter to show any user-provided Markdown string.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/component-story-mdx-description.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Story

Stories (component examples) are the basic building blocks in Storybook. In Storybook Docs, stories are rendered in the `Story` block.

![Docs blocks with stories](./docblock-story.png)

### DocsPage

In DocsPage, a `Story` block is generated for each story in your [CSF](../api/csf.md) file, it's wrapped with a `Canvas` wrapper that gives it a toolbar on top (in the case of the first “primary” story) and a source code preview underneath.

### MDX

In MDX, the `Story` block is not only a way of displaying stories, but also the primary way to define them. Storybook looks for `Story` instances with the `name` prop, either defined at the top level of the document, or directly beneath a [Canvas](#canvas) block defined at the top level:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/component-story-mdx-story-by-name.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

You can also reference existing stories in Storybook by ID:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/component-story-mdx-reference-storyid.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Inline rendering

In Storybook’s Canvas, all stories are rendered in the Preview iframe for isolated development. In Storybook Docs, when [inline rendering is supported by your framework](./docs-page.md#inline-stories-vs-iframe-stories), inline rendering is used by default for performance and convenience. However, you can force iframe rendering with `docs: { inlineStories: false }` parameter, or `inline={false}` in MDX.

## Canvas

Storybook Docs’ `Canvas` block is a wrapper that provides a toolbar for interacting with its contents, and also also provides [Source](#source) snippets automatically.

![Docs block with a story preview](./docblock-preview.png)

### DocsPage

In DocsPage, every story is wrapped in a `Canvas` block. The first story on the page is called the _primary_, and it has a toolbar. The other stories are also wrapped with `Canvas`, but there is no toolbar by default.

![Docs blocks preview toolbar](./docblock-preview-toolbar.png)

### MDX

In MDX, `Canvas` is more flexible: in addition to the DocsPage behavior, it can show multiple stories in one:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/mdx-canvas-multiple-stories.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

By default, each story will display side by side (css block). You can display stories one above the other by adding `isColumn` property to the Canvas component.

You can also place non-story content inside a `Canvas` block:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/my-component-with-story-content.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

This renders the JSX content exactly as it would if you’d placed it directly in the MDX, but it also inserts the source snippet in a [Source](#source) block beneath the block.
