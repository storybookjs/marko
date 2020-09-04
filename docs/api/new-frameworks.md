---
title: 'Frameworks'
---

Storybook is architected to support diverse web frameworks including React, Vue, Angular, Web Components, Svelte and over a dozen others. This guide helps you get started on adding new framework support for Storybook.

## Scaffolding a new framework

The first thing to do is scaffold your framework support in its own repo.

We recommend adopting the same project structure as the Storybook monorepo. That structure contains the framework package (`app/<framework>`) and an example app (`examples/<framework>-kitchen-sink`) as well as other associated documentation and configuration as needed.

This may seem like a little more hierarchy than what’s necessary. But because the structure mirrors the way Storybook’s own monorepo is structured, you can reuse Storybook’s tooling and it also makes it easier to move the framework into the Storybook into the monorepo at a later point if that is desirable.

We recommend using `@storybook/html` as a starter framework since it’s the simplest one and doesn’t contain any framework-specific oddities. There is a boilerplate to get you started [here](https://github.com/CodeByAlex/storybook-framework-boilerplate).

## Framework architecture

Supporting a new framework in Storybook typically consists of two main aspects:

1. Configuring the server. In Storybook, the server is the node process that runs when you `start-storybook` or `build-storybook`. Configuring the server typically means configuring babel and webpack in framework-specific ways.

2. Configuring the client. The client is the code that runs in the browser. Configuring the client means providing a framework-specific story rendering function.

## Configuring the server

Storybook has the concept of [presets](./addons.md#addon-presets), which are typically babel/webpack configurations for file loading. If your framework has its own file format, e.g. “.vue,” you might need to transform these files into JS files at load time. If you expect every user of your framework to need this, you should add it to the framework. So far every framework added to Storybook has done this, because Storybook’s core configuration is very minimal.

### Package structure

To add a framework preset, it’s useful to understand the package structure. Each framework typically exposes two executables in its `package.json`:

```json
{
  "bin": {
    "start-storybook": "./bin/index.js",
    "build-storybook": "./bin/build.js"
  }
}
```

These scripts pass an `options` object to `@storybook/core/server`, a library that abstracts all of Storybook’s framework-independent code.

For example, here’s the boilerplate to start the dev server in `start-storybook`:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-start-dev-server.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->


Thus the meat of adding framework presets is filling in that options object.

### Server options

As described above, the server `options` object does the heavy lifting of configuring the server.

Let’s look at the `@storybook/vue`’s options definition:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-server-options.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

The value of the `framework` option (in this case ‘vue’) is something that gets passed to addons and allows them to do special case things for your framework.

The real meat of this file is the framework presets, and these are standard [Storybook presets](./addons.md#addon-presets) -- you can look at framework packages in the Storybook monorepo (e.g. [React](https://github.com/storybookjs/storybook/blob/next/app/react/src/server/options.ts), [Vue](https://github.com/storybookjs/storybook/blob/next/app/vue/src/server/options.ts), [Web Components](https://github.com/storybookjs/storybook/blob/next/app/web-components/src/server/options.ts)) to see examples of framework-specific customizations.

When developing your own framework that is not published by storybook, you can pass the path to the framework location with the `frameworkPath` key:

```ts
// my-framework/src/server/options.ts

const packageJson = require('../../package.json');

export default {
  packageJson,
  framework: 'my-framework',
  frameworkPath: '@my-framework/storybook',
  frameworkPresets: [require.resolve('./framework-preset-my-framework.js')],
};
```

Passing a relative path to `frameworkPath` is also possible, just keep in mind that these are resolved from the storybook config directory (`.storybook` by default). 

Make sure the `frameworkPath` ends up at the `dist/client/index.js` file within your framework app.

## Configuring the client

To configure the client, you must provide a framework specific render function. Before diving into the details, it’s important to understand how user-written stories relate to what is finally rendered on the screen.

### Renderable objects

Storybook stories are ES6 functions that return a “renderable object.”

Consider the following React story:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/button-story-with-sample.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

In this case, the renderable object is the React element, `<Button .../>`.

In most other frameworks, the renderable object is actually a plain javascript object.

Consider the following hypothetical example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-hypothetical-example.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

The design of this “renderable object” is framework-specific, and should ideally match the idioms of that framework.

### Render function

The frameworks render function is the thing responsible for converting the renderable object into DOM nodes. This is typically of the form:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-framework-render-function.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

### Package structure

On the client side, the key file is [`src/client/preview.js`](../configure/overview.md#configure-story-rendering):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-client-preview.ts.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

The globals file typically sets up a single global variable that client-side code (such as addon-provided decorators) can refer to if needed to understand which framework its running in:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-client-globals-example-file.ts.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

The `start` function abstracts all of Storybook’s framework-independent client-side (browser) code, and it takes the render function we defined above. For examples of render functions, see [React](https://github.com/storybookjs/storybook/blob/next/app/react/src/client/preview/render.tsx), [Vue](https://github.com/storybookjs/storybook/blob/next/app/vue/src/client/preview/render.ts), [Angular](https://github.com/storybookjs/storybook/blob/next/app/angular/src/client/preview/render.ts), and [Web Components](https://github.com/storybookjs/storybook/blob/next/app/web-components/src/client/preview/render.ts) in the Storybook monorepo.
