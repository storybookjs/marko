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

```js
// your-page.js

import React from 'react';
import PageLayout from './PageLayout';
import DocumentHeader from './DocumentHeader';
import DocumentList from './DocumentList';

function DocumentScreen({ user, document, subdocuments }) {
  return (
    <PageLayout user={user}>
      <DocumentHeader document={document} />
      <DocumentList documents={subdocuments} />
    </PageLayout>
  );
}
```

In such cases it is natural to use [args composition](../writing-stories/args.md#args-composition) to build the stories for the page based on the stories of the sub-components:

```js
// your-page.story.js

import React from 'react';
import DocumentScreen from './DocumentScreen';

import PageLayout from './PageLayout.stories';
import DocumentHeader from './DocumentHeader.stories';
import DocumentList from './DocumentList.stories';

export default {
  component: DocumentScreen,
  title: 'DocumentScreen',
};

const Template = (args) => <DocumentScreen {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  user: PageLayout.Simple.user,
  document: DocumentHeader.Simple.document,
  subdocuments: DocumentList.Simple.documents,
};
```

This approach is particularly useful when the various subcomponents export a complex list of different stories, which you can pick and choose to build realistic scenarios for your screen-level stories without repeating yourself. By reusing the data and taking a Don't-Repeat-Yourself(DRY) philosophy, your story maintenance burden is minimal.

## Mocking connected components

Render a connected component in Storybook by mocking the network requests that it makes to fetch its data. There are various layers in which you can do that.

### Mocking providers

If you are using a provider that supplies data via the context, you can wrap your story in a decorator that supplies a mocked version of that provider. For example, in the [Screens](https://www.learnstorybook.com/intro-to-storybook/react/en/screen/) chapter of Learn Storybook we mock a Redux provider with mock data.

Additionally, there may be addons that supply such providers and nice APIs to set the data they provide. For instance [`storybook-addon-apollo-client`](https://www.npmjs.com/package/storybook-addon-apollo-client) provides this API:

```js
// my-component-with-query.story.js

import MyComponentThatHasAQuery, {
  MyQuery,
} from '../component-that-has-a-query';

export const LoggedOut = () => <MyComponentThatHasAQuery />;
LoggedOut.parameters: {
    apolloClient: {
      mocks: [
        { request: { query: MyQuery }, result: { data: { viewer: null } } },
      ],
    },
 };
```

### Mocking imports

It is also possible to mock imports directly, similar to Jest, using webpack’s aliasing. This is extremely useful if your component makes network requests directly with third-party libraries.

We're going to use [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch) as an example.

Let's start by creating our own mock, which we'll use later with a [decorator](../writing-stories/decorators#global-decorators]. Create a new file called isomorphic-fetch.js inside a directory called `__mocks__` (we'll leave the location to you, don't forget to adjust the imports to your needs) and add the following code inside:

```js
// __mocks__/isomorphic-fetch.js
let nextJson;
export default async function fetch() {
  if (nextJson) {
    return {
      json: () => nextJson,
    };
  }
  nextJson = null;
}

export function decorator(story, { parameters }) {
  if (parameters && parameters.fetch) {
    nextJson = parameters.fetch.json;
  }
  return story();
}
```

To use the mock in place of the real import, we use [webpack aliasing](https://webpack.js.org/configuration/resolve/#resolvealias):

```js
// .storybook/main.js
module.exports = {
  // your Storybook configuration

  webpackFinal: (config) => {
    config.resolve.alias['isomorphic-fetch'] = require.resolve('../__mocks__/isomorphic-fetch.js');
    return config;
  },
};
```

Add the mock you've just implemented to your [storybook/preview.js](../configure/overview.md#configure-story-rendering) (if you don't have it already, you'll need to create the file):

```js
// .storybook/preview.js
import { decorator } from '../__mocks/isomorphic-fetch';

// Add the decorator to all stories
export const decorators = [decorator];
```

Once that configuration is complete, we can set the mock values in a specific story. Let's borrow an example from this [blog post](https://medium.com/@edogc/visual-unit-testing-with-react-storybook-and-fetch-mock-4594d3a281e6):

```js
import React from 'react';

import App from './App';

export default {
  title: 'App',
  component: App,
};

const Template = (args) => <App {...args />;

export const Success = Template.bind({});
Success.parameters = {
  fetch: {
    json: {
      JavaScript: 3390991,
      'C++': 44974,
      TypeScript: 15530,
      CoffeeScript: 12253,
      Python: 9383,
      C: 5341,
      Shell: 5115,
      HTML: 3420,
      CSS: 3171,
      Makefile: 189,
    }
  }
};
```

### Specific mocks

Another mocking approach is to use libraries that intercept calls at a lower level. For instance you can use [`fetch-mock`](https://www.npmjs.com/package/fetch-mock) to mock fetch requests specifically, or [`msw`](https://www.npmjs.com/package/msw) to mock all kinds of network traffic.

Similar to the import mocking above, once you have a mock you’ll still want to set the return value of the mock on a per-story basis. Do this in Storybook with a decorator that reads story parameters.
