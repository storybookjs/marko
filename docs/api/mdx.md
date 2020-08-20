---
title: 'MDX Format'
---

`MDX` is the syntax [Storybook Docs](../writing-docs/introduction.md) uses to capture long-form Markdown documentation and stories in one file. You can also write pure documentation pages in `MDX` and add them to Storybook alongside your stories. [Read the announcement](https://medium.com/storybookjs/rich-docs-with-storybook-mdx-61bc145ae7bc) to learn more about how and why it came to be.

## Basic example

Let's get started with an example that combines Markdown with a single story:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/checkbox-story-starter-example.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

And here's how that's rendered in Storybook:

![Show a simple mdx example](./mdx-simple.png)

As you can see there's a lot going on here. We're writing Markdown, we're writing JSX, and somehow we're also defining Storybook stories that are drop-in compatible with the entire Storybook ecosystem.

Let's break it down.

## MDX-Flavored CSF

[MDX](https://mdxjs.com/) is a standard file format that combines Markdown with JSX. This means you can use Markdown’s terse syntax (such as `# heading`) for your documentation, and freely embed JSX component blocks at any point in the file.

MDX-flavored [Component Story Format (CSF)](https://medium.com/storybookjs/component-story-format-66f4c32366df) includes a collection of components called **"Doc Blocks"**, that allow Storybook to translate MDX files into storybook stories. MDX-defined stories are identical to regular Storybook stories, so they can be used with Storybook's entire ecosystem of addons and view layers.

For example, here's the story from `Checkbox` example above, rewritten in CSF:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/checkbox-story-csf.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

There's a one-to-one mapping from the code in `MDX` to `CSF`, which in turn directly corresponds to Storybook's internal `storiesOf` API. As a user, this means your existing Storybook knowledge should translate between the three. And technically, this means that the transformations that happen under the hood are simple and predictable.

## Writing stories

Now let's look at a more realistic example to see a few more things we can do:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/badge-story-starter-example.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

And here's how that gets rendered in Storybook:

![Display mdx page](./mdx-page.png)

### Embedding stories

Suppose you have an existing story and want to embed it into your docs. Here's how to show a story with ID `some--id` (check the browser URL in Storybook v5+ to see a story's ID):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/component-story-mdx-reference-storyid.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

You can also use the rest of the MDX features in conjunction with embedding. That includes source, preview, and prop tables.

### Decorators and parameters

To add [decorators](../writing-docs/mdx.md#decorators-and-parameters) and [parameters](../writing-docs/mdx.md#decorators-and-parameters) in MDX:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/my-component-story-mdx-with-decorators-params.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

In addition, global decorators work just like before, e.g. adding the following to your [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-decorator-params-example.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Documentation-only MDX

Typically, when you use Storybook MDX, you define stories in the MDX documentation is automatically associated with those stories. But what if you want to write Markdown-style documentation and have it show up in your Storybook?

If you don't define stories in your MDX, you can write MDX documentation and associate it with an existing story, or embed that MDX as its own documentation node in your Storybook's navigation.

If you don't define a `Meta`, you can write Markdown and associate with an existing story. See ["CSF Stories with MDX Docs"](../writing-docs/mdx.md).

To get a "documentation-only story", in your UI, define a `<Meta>` as you normally would, but don't define any stories. It will show up in your UI as a documentation node:

![Show documentation](./mdx-documentation-only.png)

## MDX file names

Unless you use a custom webpack configuration, all of your `MDX` files should have the suffix `*.stories.mdx`. This tells Storybook to apply its special processing to the `<Meta>` and `<Story>` elements in the file.

Be sure to update your Storybook config file to load `.stories.mdx` stories, as per the [`addon-docs` installation instructions](https://github.com/storybookjs/storybook/tree/master/addons/docs#installation).
