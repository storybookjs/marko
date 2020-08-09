---
title: 'Theming'
---

Storybook is theme-able using a lightweight theming API.

## Global theming

It's possible to theme Storybook globally.

Storybook includes two themes that look good out of the box: "normal" (a light theme) and "dark" (a dark theme). Unless you've set your preferred color scheme as dark, Storybook will use the light theme as default.

Make sure you have installed [`@storybook/addons`](https://www.npmjs.com/package/@storybook/addons) and [`@storybook/theming`](https://www.npmjs.com/package/@storybook/theming) packages.

```sh
npm install @storybook/addons --save-dev
npm install @storybook/theming --save-dev
```

As an example, you can tell Storybook to use the "dark" theme by modifying [`.storybook/manager.js`](./overview.md#configure-story-rendering):

```js
// .storybook/manager.js
import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: themes.dark,
});
```

When setting a theme, set a full theme object. The theme is replaced, not combined.

## Theming docs

[Storybook Docs](../writing-docs) uses the same theme system as Storybook’s UI, but is themed independently from the main UI.

Supposing you have a Storybook theme defined for the main UI in [`.storybook/manager.js`](./overview.md#configure-story-rendering):

```js
// .storybook/manager.js
import { addons } from '@storybook/addons';
// or a custom theme
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: themes.dark,
});
```

Here's how you'd specify the same theme for docs in [`.storybook/preview.js`](./overview.md#configure-story-rendering):

```js
// .storybook/preview.js
import { themes } from '@storybook/theming';

// or global addParameters
export const parameters = {
  docs: {
    theme: themes.dark,
  },
};
```

Continue to read if you want to learn how to create your theme.

## Create a theme quickstart

The easiest way to customize Storybook is to generate a new theme using the `create()` function from `storybook/theming`. This function includes shorthands for the most common theme variables. Here's how to use it:

First create a new file in `.storybook` called `yourTheme.js`.

Next paste the code below and tweak the variables.

```js
// yourTheme.js

import { create } from '@storybook/theming/create';

export default create({
  base: 'light',

  colorPrimary: 'hotpink',
  colorSecondary: 'deepskyblue',

  // UI
  appBg: 'white',
  appContentBg: 'silver',
  appBorderColor: 'grey',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: 'black',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: 'silver',
  barSelectedColor: 'black',
  barBg: 'hotpink',

  // Form colors
  inputBg: 'white',
  inputBorder: 'silver',
  inputTextColor: 'black',
  inputBorderRadius: 4,

  brandTitle: 'My custom storybook',
  brandUrl: 'https://example.com',
  brandImage: 'https://placehold.it/350x150',
});
```

Finally, import your theme into [`.storybook/manager.js`](./overview.md#configure-story-rendering) and add it to your Storybook parameters.

```js
// .storybook/manager.js

import { addons } from '@storybook/addons';
import yourTheme from './yourTheme';

addons.setConfig({
  theme: yourTheme,
});
```

The `@storybook/theming` package is built using TypeScript, so this should help create a valid theme for TypeScript users. The types are part of the package itself.

Many theme variables are optional, the `base` property is NOT. This is a perfectly valid theme:

```ts
import { create } from '@storybook/theming/create';

export default create({
  base: 'light',
  brandTitle: 'My custom storybook',
  brandUrl: 'https://example.com',
  brandImage: 'https://placehold.it/350x150',
});
```

## CSS escape hatches

The Storybook theme API is narrow by design. If you want to have fine-grained control over the CSS, all of the UI and Docs components are tagged with class names to make this possible. This is advanced usage: **use at your own risk**.

To style these elements, insert style tags into:

- For Storybook’s UI, use `.storybook/manager-head.html`
- For Storybook Docs, use `.storybook/preview-head.html`

<div class="aside">

Similar to changing the preview’s head tag, `.storybook/manager-head.html` allows you to inject code into the manager side, which can be useful to adding styles for your theme that target Storybook’s HTML.

WARNING: we don’t make any guarantees about the structure of Storybook’s HTML and it could change at any time. Consider yourself warned!

</div>

## MDX component overrides

If you're using MDX for docs, there's one more level of themability. MDX allows you to completely override the components that are rendered from Markdown using a components parameter. This is an advanced usage that we don't officially support in Storybook, but it's a powerful mechanism if you need it.

Here's how you might insert a custom code renderer for `code` blocks on the page, in [`.storybook/preview.js`](./overview.md#configure-story-rendering):

```js
// .storybook/preview.js

import { CodeBlock } from './CodeBlock';

export const parameters = {
  docs: {
    components: {
      code: CodeBlock,
    },
  },
};
```

You can even override a Storybook block component.

Here's how you might insert a custom `<Preview />` block:

```js
// .storybook/preview.js

import { MyPreview } from './MyPreview';

export const parameters = {
  docs: {
    components: {
      Preview: MyPreview,
    },
  },
};
```

## Addons and theme creation

Some addons require specific theme variables that a Storybook user must add. If you share your theme with the community, make sure to support the official API and other popular addons so your users have a consistent experience.

For example, the popular Actions addon uses [react-inspector](https://github.com/xyc/react-inspector/blob/master/src/styles/themes/chromeLight.js) which has themes of its own. Supply additional theme variables to style it like so:

```js

addonActionsTheme: {
  ...chromeLight,
  BASE_FONT_FAMILY: typography.fonts.mono,
  BASE_BACKGROUND_COLOR: 'transparent',
}
```

## Using the theme for addon authors

Reuse the theme variables above for a native Storybook developer experience. The theming engine relies on [emotion](https://emotion.sh/), a CSS-in-JS library.

```js
import { styled } from '@storybook/theming';
```

Use the theme variables in object notation:

```js
const Component = styled.div(({ theme }) => ({
  background: theme.background.app,
  width: 0,
}));
```

Or with template literals:

```js
const Component = styled.div`
  background: `${props => props.theme.background.app}`
  width: 0;
`;
```
