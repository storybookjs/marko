---
title: 'How to document components'
---

When you write component stories during development, you also create basic documentation to revisit later.

Storybook gives you tools to expand this basic documentation with prose and layout that feature your components and stories prominently. That allows you to create UI library usage guidelines, design system sites, and more.

<video autoPlay muted playsInline loop>
  <source
    src="addon-docs-optimized.mp4"
    type="video/mp4"
  />
</video>

If you're including Storybook in your project for the [first time](../get-started/install.md), we provide you with [DocsPage](./docs-page.md), a documentation template that lists all the stories for a component and associated metadata. It infers metadata values based on source code, types and JSDoc comments. If you need, you can customize this page to create your own custom template.

If you're already using Storybook and you're **updating** to the latest release, we recommend that you install [@storybook/addon-essentials](https://www.npmjs.com/package/@storybook/addon-essentials), to include this and other great features into your project.

You can also create free-form pages for each component using [MDX](./mdx.md), a format for simultaneously documenting components and writing stories.

In both cases, you’ll use [Doc Blocks](./doc-blocks.md) as the building blocks to create full featured documentation.

Docs is autoconfigured to work out of the box in most use cases. In some cases you may need or want to tweak the configuration. Read more about it in the [readme](../../addons/docs/README.md).
