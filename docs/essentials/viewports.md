---
title: 'Viewports'
---

<div style="background-color:#F8FAFC">
TODO: CLEANUP comments once this is vetted.
</div>

The Viewports Essential toolbar item allows you to adjust the viewport your story is rendered in via Storybook’s UI:

<div style="background-color:#F8FAFC">
TODO: add Gif mentioned in the SB 6.0 needs to be further vetted
</div>

## Configuration

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

<!-- 
### defaultViewport : String

---

Setting this property to, let say `iphone6`, will make `iPhone 6` the default device/viewport for all stories. Default is `'responsive'` which fills 100% of the preview area.

### disable : Boolean

---

Disable viewport addon per component, story or global.

### viewports : Object

---

A key-value pair of viewport's key and properties (see `Viewport` definition below) for all viewports to be displayed. Default is [`MINIMAL_VIEWPORTS`](src/defaults.ts)

#### Viewport Model

```js
{
  /**
   * name to display in the dropdown
   * @type {String}
   */
  name: 'Responsive',

  /**
   * Inline styles to be applied to the story (iframe).
   * styles is an object whose key is the camelCased version of the style name, and whose
   * value is the style’s value, usually a string
   * @type {Object}
   */
  styles: {
    width: '100%',
    height: '100%',
  },

  /**
   * type of the device (e.g. desktop, mobile, or tablet)
   * @type {String}
   */
  type: 'desktop',
}
```

<!-- 
## Configuring per component or story

There are cases where it's not effective for you to use a certain visual viewport on a global scale and you need it to adjust it to a individual story.

This Essential's addon allows you to do so. You can change your story through [parameters](../writing-stories/parameters) to include the viewports you need to use for your component. 


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

<!-- ## Examples

We've covered how  -->

### Use Detailed Set of Devices

By default Storybook uses a [minimal set of viewports](https://github.com/storybookjs/storybook/blob/master/addons/viewport/src/defaults.ts#L135) to get you started. But you're not restricted to these, the addon offers a more granular list of devices that you can use.  

Change your [`.storybook/preview.js`](../configure/overview#configure-story-rendering) to the following:

<!-- If you need to use a more granular list of devices, you can use [`INITIAL_VIEWPORTS`](https://github.com/storybookjs/storybook/blob/master/addons/viewport/src/defaults.ts#L3)

The default viewports being used is [`MINIMAL_VIEWPORTS`](src/defaults.ts). If you'd like to use a more granular list of devices, you can use [`INITIAL_VIEWPORTS`](src/defaults.ts) like so in your `.storybook/preview.js` file. -->

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

<!-- ### Use Custom Set of Devices

This will replace all previous devices with `Kindle Fire 2` and `Kindle Fire HD` by calling `addParameters` with the two devices as `viewports` in `.storybook/preview.js` file.

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

export const parameters = {
  viewport: { viewports: customViewports },
};
``` -->

### Add New Devices

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

## Configuring per component or story

There are cases where it's not effective for you to use a certain visual viewport on a global scale and you need it to adjust it to a individual story.

This Essential's addon allows you to do so. You can change your story through [parameters](../writing-stories/parameters) to include the viewports you need to use for your component. 


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