---
id: 'composition'
title: 'Storybook Composition'
---

Storybook composition is a feature that allows you to compose multiple storybook together. This can be useful if

- you have a need for multiple frameworks
- you have multiple teams using separate storybooks
- you are using community component libraries

---

## Composing a storybook

To compose another storybook into yours, all you need is the URL of storybook.

Here's how you do it:

```js
// main.js
module.exports = {
  refs: {
    // long form
    example: {
      title: 'My composed storybook',
      url: 'https://next--storybookjs.netlify.app/ember-cli',
    },
    // shorthand
    cra: 'https://next--storybookjs.netlify.app/cra-ts-kitchen-sink',
  },
}
```

The above code adds 2 refs to storybook.

The storybooks being composed don't need to be of the same version or using the same framework.

> Composing storybooks from < 6 is supported, as long as the storybooks are hosted on unique origins. If you want to compose multiple storybooks from the same origin, those must all be version 6 or higher.

### Automatic loading

The process above is actually often not even required! Storybook will auto-compose direct dependencies' storybooks if it's able to find them.

The ref will be auto-loaded if the **direct dependency** has a field called `storybook` in it's `package.json` which looks like this:

```json
{
  "storybook": {
    "title": "My Package",
    "url": "https://my.storybook-url.com"
  }
}
```

This is really useful if you depend on a component library that is also using storybook.

Not only do you get to view all of their stories, but their documentation too, if they use [addon-docs](https://github.com/storybookjs/storybook/tree/master/addons/docs)!

## Preparing to have your storybook composed

Publish your (static) storybook online using any hosting platform, ensuring CORS is enabled.

When a user composes many storybooks together this may add considerable weight to the page-load.

We want to make sure the user composing storybooks together isn't loading the entire storybook just to see the stories appear in the sidebar.

To optimize the loading of refs we want to generate a `stories.json` file, which contains a static list of all the stories and the parameters needed to render in the sidebar.

This can be done with the storybook-cli: `npx sb extract`. It requires you have a built storybook. 
You may pass it 2 arguments for where you have storybook built, and where you wannt `stories.json` to be placed: `npx sb extract <where-your-storybook-static-is> <where-you-want-stories-json>`.

For an example what this file should look like, see: [here](https://next--storybookjs.netlify.app/dev-kits/stories.json).

### Authentication

If you have some authentication layer on your hosted storybook, the composing the storybook will fail. Storybook will show a message in the sidebar if that happens.


You can assist the user by creating a `metadata.json` file with a `loginUrl` field, and ensure this file **is** loadable (even in the user is not authenticated):

```json
{
  "loginUrl": "https://example.com"
}
```

Storybook will show a UI to assist the user to login, and then reload the composed storybook.

## Advanced

When you compose a storybook into your own, you get **all** the stories, in their original format. You may not agree with some names, or you might want to filter or sort some stories to your liking.

You can add a 'mapper' to storybook that will be used to transform the received stories to something of your liking.

```js
import { addons } from '@storybook/addons';

addons.setConfig({
  storyMapper: (ref, story) => {
    return { ...a, kind: a.kind.replace('|', '/') };
  }
});
```

You can remove stories by returning `null`.
