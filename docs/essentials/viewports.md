---
title: 'Viewports'
---

The Viewports toolbar item allows you to adjust the dimensions of the iframe your story is rendered in. This makes it easy to develop responsive UIs.

<video autoPlay muted playsInline loop>
  <source
    src="addon-viewports-optimized.mp4"
    type="video/mp4"
  />
</video>

### Configuration

By default, you are presented with a set of common viewports. 

If you want to change the default set of viewports, you can set the global `parameters.viewport` [parameter](../writing-stories/parameters) in your [`.storybook/preview.js`](../configure/overview#configure-story-rendering):

```js
// .storybook/preview.js
export const parameters: {
  viewport: {
    viewports: newViewports, // newViewports would be an ViewportMap. (see below for examples)
    defaultViewport: 'someDefault',
  },
}
```

The viewport global can take a object with the following keys:

| Field                  | Type          | Description                                            |Default Value |
| -----------------------|:-------------:|:------------------------------------------------------:|:------------:|
| **defaultViewport**    | String        |Sets the default viewport                               |`'responsive'`|
| **disable**            | Boolean       |Disables the viewport                                   |N/A           |
| **viewports**          | Object        |The configuration object for the viewport               |`{}`          |


The viewports object needs the following keys:

| Field                  | Type          | Description                                            |Example values                             |
| -----------------------|:-------------:|:-------------------------------------------------------|:-----------------------------------------:|
| **name**               | String        |Name for the viewport                                   |`'Responsive'`                             |
| **styles**             | Object        |Sets Inline styles to be applied to the story           |`{width:0,height:0}`                       |
| **type**               | String        |Type of the device (e.g. desktop, mobile, or tablet)    |`desktop`                                  |

### Use detailed set of devices

By default Storybook uses a [minimal set of viewports](https://github.com/storybookjs/storybook/blob/master/addons/viewport/src/defaults.ts#L135) to get you started. But you're not restricted to these, the addon offers a more granular list of devices that you can use.  

Change your [`.storybook/preview.js`](../configure/overview#configure-story-rendering) to the following:

```js
// .storybook/preview.js

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

export const parameters = {
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
};
```

Once you start your Storybook, you'll see that now you have a whole different set of devices to use.

See [here](https://github.com/storybookjs/storybook/blob/master/addons/viewport/src/defaults.ts#L3) the complete list of devices and their configurations.

### Add new devices

If you have either a specific viewport, or a list of viewports that you need to use. You can modify your  [`.storybook/preview.js`](../configure/overview#configure-story-rendering) file to include them like so:

```js
//.storybook/preview.js

const customViewports = {
  kindleFire2: {
    name: 'Kindle Fire 2',
    styles: {
      width: '600px',
      height: '963px',
    },
  },
  kindleFireHD: {
    name: 'Kindle Fire HD',
    styles: {
      width: '533px',
      height: '801px',
    },
  },
};
```

To use them in your Storybook you'll need to make the following change:

```js
//.storybook/preview.js

export const parameters = {
  viewport: { viewports: customViewports },
};
```

Once you start Storybook, you'll see your new viewports and devices.

If you need, you can also add these two to another list of viewports. 

For instance, if you wanted to use these two with the minimal set of viewports, you can do it like so:

```js
//.storybook/preview.js

import { MINIMAL_VIEWPORTS} from '@storybook/addon-viewport';

const customViewports = {
  kindleFire2: {
    name: 'Kindle Fire 2',
    styles: {
      width: '600px',
      height: '963px',
    },
  },
  kindleFireHD: {
    name: 'Kindle Fire HD',
    styles: {
      width: '533px',
      height: '801px',
    },
  },
};

export const parameters = {
  viewport: {
    viewports: {
       ...MINIMAL_VIEWPORTS,
      ...customViewports,
    },
  },
};
```


This will add both `Kindle Fire 2` and `Kindle Fire HD` to the list of devices. This is achieved by making use of the exported [`MINIMAL_VIEWPORTS`](https://github.com/storybookjs/storybook/blob/master/addons/viewport/src/defaults.ts#L135) property, by merging it with the new ones.

```js
import {
  INITIAL_VIEWPORTS,
  // or MINIMAL_VIEWPORTS,
} from '@storybook/addon-viewport';

const customViewports = {
  kindleFire2: {
    name: 'Kindle Fire 2',
    styles: {
      width: '600px',
      height: '963px',
    },
  },
  kindleFireHD: {
    name: 'Kindle Fire HD',
    styles: {
      width: '533px',
      height: '801px',
    },
  },
};

export const parameters = {
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      // or ...MINIMAL_VIEWPORTS,
      ...customViewports,
    },
  },
};
```

### Configuring per component or story

There are cases where it's not effective for you to use a certain visual viewport on a global scale and you need it to adjust it to a individual story.

You can change your story through [parameters](../writing-stories/parameters) to include the viewports you need to use for your component.


[Parameters](../writing-stories/parameters) can be configured for a whole set of stories or a single story via the standard parameter API: 

```js
// my-story.story.js

export default {
  title: 'Stories',
  parameters: {
    // the viewports object from the Essentials addon
    viewport: {
      // the viewports you want to use
      viewports: INITIAL_VIEWPORTS,
      // your own default viewport
      defaultViewport: 'iphone6'
    },
  };
};

export const myStory = () => <div />;
myStory.parameters = {
  viewport: {
    defaultViewport: 'iphonex'
  },
};
```