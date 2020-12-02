---
title: 'Writing your own Storybook addon'
---

One of Storybook's main features is it's robust addon ecosystem. Addons can be used to enhance your developer experience or workflows. We're going to guide you with the necessary steps to create your own first addon.

## The addon we're building

For this example we're going to build a bare-bones addon which:

- Adds a new panel in Storybook.
- Retrieves a custom parameter from the stories.
- Displays the parameter data in the panel.

### Anatomy of an addon

The addon we're about to build as other existing Storybook addons will follow a common file and directory structure. Applying this pattern will enforce development good practices. 

Below is a brief overview of how the addon we're about to create will look like:


| Files/Directories | Description                       |
|:------------------|:----------------------------------|
| dist              | Transpiled directory for the addon|
| src               | Source code for the addon         |
| .babelrc.js       | Babel configuration               |
| register.js       | Addon entry point                 |
| package.json      | Addon metadata information        |
| README.md         | General information for the addon |

### Get started

Open a new terminal and create a new directory called `my-addon`. Inside it run `npm init` to initialize a new node project. For project's name enter `my-addon` and for entry point choose `dist/register.js`. 

Once you've gone through the prompts your `package.json` should look like so:

```json
{
  "name": "my-addon",
  "version": "1.0.0",
  "description": "A barebones Storybook addon",
  "main": "dist/register.js",
  "files": [
    "dist/**/*",
    "README.md",
    "*.js"
  ],
  "keywords": [
    "storybook",
    "addons"
  ],
  "author": "YourUsername",
  "license": "MIT"
}
```

### Build system

We'll need to add the necessary dependencies and make some adjustments. With a terminal opened inside your addon directory issue the following commands:

```shell
# Installs React
yarn add react react-dom

# Adds Storybook:
npx -p @storybook/cli sb init
```

<div class="aside">
Initializing a new Storybook installation through <code>npx -p @storybook/cli sb init</code> will grant us access to the necessary Storybook packages for our addon. If you're 
building your own standalone Storybook addon you'll need to set both React and Storybook packages as peer dependencies. Applying this change will prevent the addon from breaking Storybook in case there's different package versions available.
</div>

Next create a `.babelrc.js` file in the root directory with the following:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/my-addon-babel-configuration.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">
Because the addon we're about to write will use ES6 and rely on JSX, thus we'll need to include Babel and configure it with the proper presets and options. 
</div>

Change your `package.json` and add the following script to build the addon:

```json
{
  "scripts": {
    "build": "babel ./src --out-dir ./dist"
  },
}
```
<div class="aside">
Running <code>yarn build</code> at this stage will output the code into the <code>dist</code> directory, transpiled into a ES5 module ready to be installed into any Storybook. 
</div>

### Add a panel

Now let’s add a panel to Storybook. Create a new directory called `src` and inside a new file called `register.js`.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-addon-panel-initial.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">
Make sure to include the <code>key</code> when you register the addon. This will prevent any issues when the addon renders.
</div> 

Going over the code snippet in more detail, here's what's going to happen when Storybook starts up:

- Storybook [registers](./addons-api.md#addonsregister) a new addon called `my-addon`.
- The addon [adds]((./addons-api.md#addonsadd)) a new `panel` to the UI.
- When the `panel` is selected it will render the static `div` content.


### Register the addon

Finally, let’s hook it all up. Change `.storybook/main.js` to the following:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/my-addon-storybook-registration.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">
When you register a Storybook addon, it will look for either <code>register.js</code> or <code>preset.js</code> as the entry points.
</div>

Run `yarn storybook` and you should see something similar to:

![Storybook addon initial state](./addon-initial-state.png)


### Display story parameter

Next, let’s replace the `MyPanel` component from above to show the parameter.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-addon-change-panel.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

The new version is made smarter by [`useParameter`](./addons-api.md#useparameter), which is a [React hook](https://reactjs.org/docs/hooks-intro.html) that updates the parameter value and re-renders the panel every time the story changes.

The [addon API](./addons-api.md) provides hooks like this so all of that communication can happen behind the scenes. That means you can focus on your addon's functionality.


### Using the addon with a story

When Storybook was initialized it provided a small set of example stories that can be used to test if the addon is functioning as expected. Change your `stories/Button.stories.js` to the following:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/button-story-with-addon-example.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->


After applying the changes to the story your Storybook UI will now yield the following:


<video autoPlay muted playsInline loop>
  <source
    src="addon-final-stage-optimized.mp4"
    type="video/mp4"
  />
</video>

### Root level register.js

Before publishing the addon, we'll need to make one additional change. In the root directory of the addon create a new file called `register.js` and add the following:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/my-addon-root-level-register.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

The sole purpose of making this change is to help with the registration process of the addon. By design Storybook looks for either a `preset.js` or a `register.js` file located at the root level. Omitting this file would require additional configuration from the addon consumer.


### Packaging and publishing

With the example above we showed how to create a bare-bones addon. Before publishing and distributing your own addon make sure you have met the following requirements:

- A `package.json file` with metadata about the addon.
- Peer dependencies of `react` and `@storybook/addons`.
- A `register.js` file at the root level written as an ES5 module.
- A `src` directory containing the ES6 addon code.
- A `dist` directory containing transpiled ES5 code on publish.
- A [GitHub](https://github.com/) account to host your code.
- A [NPM](https://www.npmjs.com/) account to publish the addon.

For a good template of an addon that meets the requirements above, check out [storybook-addon-outline](https://www.npmjs.com/package/storybook-addon-outline).

### Next steps

In the previous example, we introduced the structure of an addon, but barely scratched the surface of what addons can do.

To dive deeper we recommend [Learn Storybook’s “creating addons”](https://www.learnstorybook.com/intro-to-storybook/react/en/creating-addons/) tutorial. It’s an excellent walkthrough that covers the same ground as the above introduction, but goes further and leads you through the full process of creating a realistic addon. Or [how to build a Storybook addon](https://www.chromatic.com/blog/how-to-build-a-storybook-addon/) blog post that guides you through the steps of creating a standalone addon in great length.

### Dev kits

To help you jumpstart the addon development, the Storybook maintainers created some [`dev-kits`](https://github.com/storybookjs/storybook/tree/next/dev-kits), use them as reference when building your next addon.

