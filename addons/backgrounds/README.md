# Storybook Addon Backgrounds

Storybook Background Addon can be used to change background colors inside the preview in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

![React Storybook Screenshot](https://raw.githubusercontent.com/storybookjs/storybook/master/docs/static/img/addon-backgrounds.gif)

## Installation

```sh
yarn add @storybook/addon-backgrounds --dev
```

## Configuration

If it doesn't exist yet, create a file called `main.js` in your storybook config.

Add the following content to it:

```js
module.exports = {
  addons: ['@storybook/addon-backgrounds'],
};
```

## Usage

Backgrounds requires two parameters:

- `default` - matches the **name** of the value which will be selected by default.
- `values` - an array of elements containing name and value (with a valid css color e.g. HEX, RGBA, etc.)

It ships with the following defaults:

- no selected background (transparent)
- light/dark options in the menu

Write your stories like this:

```jsx
import React from 'react';

/*
 * Button.stories.js
 * Applies backgrounds to the Stories
 */
export default {
  title: 'Button',
  parameters: {
    backgrounds: {
      default: 'twitter',
      values: [
        { name: 'twitter', value: '#00aced' },
        { name: 'facebook', value: '#3b5998' },
      ],
    },
  },
};

export const defaultView = () => <button>Click me</button>;
```

You can add the backgrounds to all stories by using `parameters` in `.storybook/preview.js`:

```js
export const parameters = {
  backgrounds: {
    default: 'twitter',
    values: [
      { name: 'twitter', value: '#00aced' },
      { name: 'facebook', value: '#3b5998' },
    ],
  },
};
```

If you want to override backgrounds for a single story or group of stories, pass the `backgrounds` parameter:

```jsx
import React from 'react';

export default {
  title: 'Button',
};

export const defaultView = () => <button>Click me</button>;

defaultView.parameters = {
  backgrounds: {
    default: 'red',
    values: [{ name: 'red', value: 'rgba(255, 0, 0)' }],
  },
};
```

Once you have defined backgrounds for your stories (as can be seen in the examples above), you can set a default background per story by passing the `default` property using a name from the available backgrounds:

```jsx
import React from 'react';

/*
 * Button.stories.js
 * Applies default background to the Stories
 */
export default {
  title: 'Button',
  parameters: {
    backgrounds: { default: 'twitter' },
  },
};

export const twitterColorSelected = () => <button>Click me</button>;
```

If you don't want to use backgrounds for a story, you can set the `backgrounds` parameter to `{ disable: true }` to skip the addon:

```jsx
import React from 'react';

/*
 * Button.stories.js
 * Disables backgrounds for one Story
 */
export default {
  title: 'Button',
};

export const disabledBackgrounds = () => <button>Click me</button>;

disabledBackgrounds.parameters = {
  backgrounds: { disable: true },
};
```
