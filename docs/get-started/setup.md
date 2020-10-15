---
title: 'Setup Storybook'
---

Now that you’ve learned what stories are and how to browse them, let’s demo working on one of your components.

Pick a simple component from your project, like a Button, and write a `.stories.js` file to go along with it. It might look something like this:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/your-component.js.mdx',
    'react/your-component.ts.mdx',
    'angular/your-component.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Go to your Storybook to view the rendered component. It’s OK if it looks a bit unusual right now.

Depending on your technology stack, you also might need to configure the Storybook environment further.

## Configure Storybook for your stack

Storybook comes with a permissive [default configuration](../configure/overview.md). It attempts to customize itself to fit your setup. But it’s not foolproof.

Your project may have additional requirements before components can be rendered in isolation. This warrants customizing configuration further. There are three broad categories of configuration you might need.

<details>
<summary>Build configuration like webpack and Babel</summary>

If you see errors on the CLI when you run the `yarn storybook` command. It’s likely you need to make changes to Storybook’s build configuration. Here are some things to try:

- [Presets](../api/presets.md) bundle common configurations for various technologies into Storybook. In particular presets exist for Create React App, SCSS and Ant Design.
- Specify a custom [Babel configuration](../configure/babel.md#custom-babel-config) for Storybook. Storybook automatically tries to use your project’s config if it can.
- Adjust the [webpack configuration](../configure/webpack.md) that Storybook uses. Try patching in your own configuration if needed.

</details>

<details>
<summary>Runtime configuration</summary>

If Storybook builds but you see an error immediately when connecting to it in the browser, then chances are one of your input files is not compiling/transpiling correctly to be interpreted by the browser. Storybook supports modern browsers and IE11, but you may need to check the Babel and webpack settings (see above) to ensure your component code works correctly.

</details>

<details id="component-context" name="component-context">
<summary>Component context</summary>

If a particular story has a problem rendering, often it means your component expects a certain environment is available to the component.

A common frontend pattern is for components to assume that they render in a certain “context” with parent components higher up the rendering hierarchy (for instance theme providers)

Use [decorators](../writing-stories/decorators.md) to “wrap” every story in the necessary context providers. [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering) allows you to customize how components render in Canvas, the preview iframe. In this decorator example, we wrap every component rendered in Storybook with `ThemeProvider`.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/storybook-preview-with-styled-components-decorator.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

</details>

## Render component styles

Storybook isn’t opinionated about how you generate or load CSS. It renders whatever DOM elements you provide. But sometimes things won’t “look right” out of the box.

You may have to configure your CSS tooling for Storybook’s rendering environment. Here are some tips on what could help:

<details>
  <summary>CSS-in-JS like styled-components and Emotion</summary>

If you are using CSS-in-JS, chances are your styles are working because they’re generated in JavaScript and served alongside each component.

Theme users may need to add a decorator to `.storybook/preview.js`, [see above](#component-context).

</details>

<details>
  <summary>@import CSS into components</summary>

Storybook allows you to import CSS files in your components directly. But in some cases you may need to [tweak the webpack config](../configure/webpack.md#extendingstorybooks-webpack-config). Angular components require [a special import](../configure/styling-and-css.md#importing-css-files).

</details>

<details>
  <summary>Global imported styles</summary>

If you have global imported styles, create a file called [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering) and import the styles there. The styles will be added by Storybook automatically for all stories.

</details>

<details>
  <summary>Add external CSS or fonts in the &lt;head&gt;</summary>

Alternatively if you want to inject a CSS link tag to the `<head>` directly (or some other resource like a font link), you can use [`.storybook/preview-head.html`](../configure/story-rendering.md#adding-to-&#60head&#62) to add arbitrary HTML.

</details>

## Load assets and resources

If you want to link to static files in your project or stories (e.g. `/fonts/XYZ.woff`), use the `-s path/to/folder` to specify a static folder to serve from when you start up Storybook. To do so, edit the `storybook` and `build-storybook` scripts in `package.json`.

We recommend serving external resources and assets requested in your components statically with Storybook. This ensures that assets are always available to your stories.
