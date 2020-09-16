---
title: 'Styling and CSS'
---

There are many ways to include CSS in a web application, and correspondingly there are many ways to include CSS in Storybook. Usually it is best to try and replicate what your application does with styling in Storybook’s configuration.

### CSS-in-JS

CSS-in-JS libraries are designed to use basic JavaScript. They often work in Storybook without any extra configuration. Some libraries expect components to be rendered in a specific rendering “context” (for example, to provide themes) and you may need to add a [global decorator](../writing-stories/decorators.md#global-decorators) to supply it.

### Importing CSS files

If your component files import their own CSS, Storybook’s webpack config will work unmodified with some exceptions:

- If you are using a CSS precompiler, you may need to add a preset (such as the [SCSS preset](https://github.com/storybookjs/presets/tree/master/packages/preset-scss), or add a loader to Storybook’s webpack config).
- In Angular, you'll need to take special care how you handle CSS:

  - Either [customize your webpack config](./webpack#extending-storybooks-webpack-config)
  - Or use syntax to use a inline loader:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'angular/storybook-angular-inline-css-loader.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

To use your CSS in all stories, you simply import it in [`.storybook/preview.js`](./overview.md#configure-story-rendering)

### Adding webfonts

If you need webfonts to be available, you may need to add some code to the [`.storybook/preview-head.html`](./story-rendering.md#adding-to-head) file. We recommend including any assets with your Storybook if possible, in which case you likely want to configure the [static file location](./images-and-assets#serving-static-files-via-storybook).
