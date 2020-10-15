---
title: 'Story rendering'
---

In Storybook, your stories render in a special “preview” iframe (Canvas tab) inside the larger Storybook web application. The JavaScript build configuration of the preview is controlled by a [webpack](./webpack.md) config, but you also may want to directly control the HTML that is rendered to help your stories render correctly.

## Adding to &#60;head&#62;

If you need to add extra elements to the `head` of the preview iframe, for instance to load static stylesheets, font files, or similar, you can create a file called [`.storybook/preview-head.html`](./overview.md#configure-story-rendering) and add tags like this:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-head-example.html.mdx',
  ]}
/>

<!-- prettier-ignore-end -->


<div class="aside">

Storybook will inject these tags into the _preview iframe_ where your components are rendered not the Storybook application UI.

</div>

## Adding to &#60;body&#62;

Sometimes, you may need to add different tags to the `<body>`. This is useful for adding some custom content roots.

You can accomplish this by creating a file called `preview-body.html` inside your `.storybook` directory and add tags like this:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-body-example.html.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

If using relative sizing in your project (like `rem` or `em`), you may update the base `font-size` by adding a `style` tag to `preview-body.html`:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-body-font-size.html.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

Storybook will inject these tags into the _preview iframe_ where your components are rendered not the Storybook application UI.

</div>
