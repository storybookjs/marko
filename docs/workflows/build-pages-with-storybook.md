---
title: 'Building pages with Storybook'
---

Storybook helps you build any component, from small “atomic” components to composed pages. But as you move up the component hierarchy toward the level of pages, you end up dealing with more complexity.

There are many ways to build pages in Storybook. Here are common patterns and solutions.

- Pure presentational pages.
- Connected components (e.g. network requests, context, browser environment).

## Pure presentational pages

Teams at the BBC, The Guardian, and the Storybook maintainers themselves build pure presentational pages. If you take this approach, you don't need to do anything special to render your pages in Storybook.

It's straightforward to write components to be fully presentational all the way up to the screen level. That makes it easy to show in Storybook. The idea is you then do all the messy “connected” logic in a single wrapper component in your app outside of Storybook. You can see an example of this approach in the [Data](https://www.learnstorybook.com/intro-to-storybook/react/en/data/) chapter of Learn Storybook.

The benefits:

- Easy to write stories once components are in this form.
- All the data for the story is encoded in the args of the story, which works well with other parts of Storybook's tooling (e.g. [controls](../essentials/controls.md)).

The downsides:

- Your existing app may not be structured in this way and it may be difficult to change it.

- Fetching data in one place means that you need to drill it down to the components that actually use it. This can be natural in a page that composes one big GraphQL query (for instance), but in other data fetching approaches may make this less appropriate.

- It's less flexible if you want to load data incrementally in different places on the screen.

### Args composition for presentational screens

When you are building screens in this way, it is typical that the inputs of a composite component are a combination of the inputs of the various sub-components it renders. For instance, if your screen renders a page layout (containing details of the current user), a header (describing the document you are looking at), and a list (of the subdocuments), the inputs of the screen may consist of the user, document and subdocuments.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/simple-page-implementation.js.mdx',
    'react/simple-page-implementation.ts.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

In such cases it is natural to use [args composition](../writing-stories/args.md#args-composition) to build the stories for the page based on the stories of the sub-components:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/page-story-with-args-composition.js.mdx',
     'react/page-story-with-args-composition.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

This approach is particularly useful when the various subcomponents export a complex list of different stories, which you can pick and choose to build realistic scenarios for your screen-level stories without repeating yourself. By reusing the data and taking a Don't-Repeat-Yourself(DRY) philosophy, your story maintenance burden is minimal.

## Mocking connected components

If you need to render a connected component in Storybook, you can mock the network requests that it makes to fetch its data. There are various layers in which you can do that.

### Mocking providers

If you are using a provider that supplies data via the context, you can wrap your story in a decorator that supplies a mocked version of that provider. For example, in the [Screens](https://www.learnstorybook.com/intro-to-storybook/react/en/screen/) chapter of Learn Storybook we mock a Redux provider with mock data.

Additionally, there may be addons that supply such providers and nice APIs to set the data they provide. For instance [`storybook-addon-apollo-client`](https://www.npmjs.com/package/storybook-addon-apollo-client) provides this API:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/component-story-with-query.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Mocking imports

It is also possible to mock imports directly, as you might in a unit test, using webpack’s aliasing. This is extremely useful if your component makes network requests directly with third-party libraries.

We're going to use [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch) as an example.

Let's start by creating our own mock, which we'll use later with a [decorator](../writing-stories/decorators#global-decorators). Create a new file called `isomorphic-fetch.js` inside a directory called `__mocks__` (we'll leave the location to you, don't forget to adjust the imports to your needs) and add the following code inside:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/isomorphic-fetch-mock.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

The above code creates a decorator which reads story-specific data off the story's [parameters](../writing-stories/parameters), allowing you to configure the mock on a per-story basis.

To use the mock in place of the real import, we use [webpack aliasing](https://webpack.js.org/configuration/resolve/#resolvealias):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-with-mock-decorator.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Add the decorator you've just implemented to your [storybook/preview.js](../configure/overview.md#configure-story-rendering) (if you don't have it already, you'll need to create the file):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-with-mock-decorator.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Once that configuration is complete, we can set the mock values in a specific story. Let's borrow an example from this [blog post](https://medium.com/@edogc/visual-unit-testing-with-react-storybook-and-fetch-mock-4594d3a281e6):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/app-story-with-mock.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Specific mocks

Another mocking approach is to use libraries that intercept calls at a lower level. For instance you can use [`fetch-mock`](https://www.npmjs.com/package/fetch-mock) to mock fetch requests specifically, or [`msw`](https://www.npmjs.com/package/msw) to mock all kinds of network traffic.

Similar to the import mocking above, once you have a mock you’ll still want to set the return value of the mock on a per-story basis. Do this in Storybook with a decorator that reads story parameters.
