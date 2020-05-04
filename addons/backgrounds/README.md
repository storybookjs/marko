# Storybook Addon Backgrounds

Storybook Background Addon can be used to change background colors inside the preview in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

![React Storybook Screenshot](https://raw.githubusercontent.com/storybookjs/storybook/master/docs/static/img/addon-backgrounds.gif)

## Installation

```sh
npm i -D @storybook/addon-backgrounds
```

## Configuration

If it doesn't exist yet, create a file called `main.js` in your storybook config.

Add the following content to it:

```js
module.exports = {
  addons: ['@storybook/addon-backgrounds']
}
```

## Usage

Backgrounds requires two parameters: 
* `default` - matches the **name** of the value which will be selected by default.
* `values`  - an array of elements containing name and value (with a valid css color e.g. HEX, RGBA, etc.)

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

export const defaultView = () => (
  <button>Click me</button>
);
```

You can add the backgrounds to all stories with `addParameters` in `.storybook/preview.js`:

```js
import { addParameters } from '@storybook/react'; // <- or your storybook framework

addParameters({
  backgrounds: {
    default: 'twitter',
    values: [
      { name: 'twitter', value: '#00aced' },
      { name: 'facebook', value: '#3b5998' },
    ],
  },
});
```

If you want to override backgrounds for a single story or group of stories, pass the `backgrounds` parameter:

```jsx
import React from 'react';

export default {
  title: 'Button',
}

export const defaultView = () => (
  <button>Click me</button>
);

defaultView.story = {
  parameters: {
    backgrounds: {
      default: 'red',
      values: [
        { name: 'red', value: 'rgba(255, 0, 0)' },
      ],
    },
  }
};
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
}

export const disabledBackgrounds = () => (
  <button>Click me</button>
);

disabledBackgrounds.story = {
  parameters: {
    backgrounds: { disable: true },
  },
};
```
