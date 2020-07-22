---
title: 'Introduction'
---

When you write component stories during development, you also create basic documentation to revisit later. 

Storybook gives you tools to expand this basic documentation with prose and layout that feature your components and stories prominently. That allows you to create UI library usage guidelines, design system sites, and more.

<div style="background-color:#F8FAFC">
TODO: add image per screenshot requirements (Image of various SB docs sites)
</div>

Out of the box, Storybook ships with [DocsPage](./docs-page), a documentation template that lists all the stories for a component and associated metadata. It infers metadata values based on source code, types and JSDoc comments. [Customize](./docs-page#replacing-docspage) this page to create a new template if you have specific requirements.

You can also create free-form pages for each component using [MDX](./mdx), a format for simultaneously documenting components and writing stories. 

In both cases, you’ll use [Doc Blocks](./docs-blocks) as the building blocks to create full featured documentation.

<div style="background-color:#F8FAFC">
TODO: ask tom if this is the proper place for the advanced
</div>

Docs is autoconfigured to work out of the box in most use cases. In some cases you may need or want to tweak the configuration. Read more about it in the [ADVANCED README](./docs-page#remixing-docspage-using-doc-blocks).

