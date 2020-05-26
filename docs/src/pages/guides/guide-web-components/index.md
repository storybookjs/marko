---
id: 'guide-web-components'
title: 'Storybook for Web Components'
---

## Automatic setup

You may have tried to use our quick start guide to setup your project for Storybook.
If it failed because it couldn't detect you're using web components, you could try forcing it to use web_components:

```sh
npx -p @storybook/cli sb init --type web_components
```

## Manual setup

If you want to set up Storybook manually for your web components project, this is the guide for you.

## Step 1: Add dependencies

### Init npm if necessary

If you don't have `package.json` in your project, you'll need to init it first:

```sh
npm init
```

### Add @storybook/web-components

Add `@storybook/web-components` to your project. To do that, run:

```sh
npm install @storybook/web-components --save-dev
```

### Add lit-html, @babel/core and babel-loader

Make sure that you have `lit-html`, `@babel/core`, and `babel-loader` in your dependencies as well because we list these as a peer dependencies:

```sh
npm install lit-html babel-loader @babel/core --save-dev
```

## Step 2: Add npm scripts

Then add the following scripts to your `package.json` in order to start the storybook later in this guide:

```json
{
  "scripts": {
    "storybook": "start-storybook",
  }
}
```

## Step 3: Create the main file

For a basic Storybook configuration, the only thing you need to do is tell Storybook where to find stories.

To do that, create a file at `.storybook/main.js` with the following content:

```js
module.exports = {
  stories: ['../src/**/*.stories.[tj]s'],
};
```

That will load all the stories underneath your `../src` directory that match the pattern `*.stories.[tj]s`. We recommend co-locating your stories with your source files, but you can place them wherever you choose.

## Step 4: Write your stories

Now create a `../src/index.stories.js` file, and write your first story like this:

```js
import { html } from 'lit-html';

export default { title: 'Button' };

export const WithText = () => html`
  <button @click=${() => console.log('clicked')}>
    Hello Button
  </button>
`;

export const WithEmoji = () => html`
  <button>
    😀 😎 👍 💯
  </button>
`;
```

Each story is a single state of your component. In the above case, there are two stories for the demo button component:

```plaintext
Button
  ├── With Text
  └── With Emoji
```

## Finally: Run your Storybook

Now everything is ready. Run your storybook with:

```sh
npm run storybook
```

Storybook should start, on a random open port in dev-mode.

Now you can develop your components and write stories and see the changes in Storybook immediately since it uses Webpack's hot module reloading.
