---
title: 'Viewport'
---

The Viewport toolbar item allows you to adjust the dimensions of the iframe your story is rendered in. This makes it easy to develop responsive UIs.

<video autoPlay muted playsInline loop>
  <source
    src="addon-viewports-optimized.mp4"
    type="video/mp4"
  />
</video>

### Configuration

By default, you are presented with a set of common viewports.

If you want to change the default set of viewports, you can set the global `parameters.viewport` [parameter](../writing-stories/parameters.md) in your [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-change-viewports.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

The viewport global can take a object with the following keys:

| Field               |  Type   |                Description                | Default Value  |
| ------------------- | :-----: | :---------------------------------------: | :------------: |
| **defaultViewport** | String  |         Sets the default viewport         | `'responsive'` |
| **disable**         | Boolean |           Disables the viewport           |      N/A       |
| **viewports**       | Object  | The configuration object for the viewport |      `{}`      |

The viewports object needs the following keys:

| Field      |  Type  | Description                                          |    Example values    |
| ---------- | :----: | :--------------------------------------------------- | :------------------: |
| **name**   | String | Name for the viewport                                |    `'Responsive'`    |
| **styles** | Object | Sets Inline styles to be applied to the story        | `{width:0,height:0}` |
| **type**   | String | Type of the device (e.g. desktop, mobile, or tablet) |      `desktop`       |

### Use detailed set of devices

By default Storybook uses a [minimal set of viewports](https://github.com/storybookjs/storybook/blob/master/addons/viewport/src/defaults.ts#L135) to get you started. But you're not restricted to these, the addon offers a more granular list of devices that you can use.

Change your [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering) to the following:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-granular-viewports.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Once you start your Storybook, you'll see that now you have a whole different set of devices to use.

See [here](https://github.com/storybookjs/storybook/blob/master/addons/viewport/src/defaults.ts#L3) the complete list of devices and their configurations.

### Add new devices

If you have either a specific viewport, or a list of viewports that you need to use. You can modify your [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering) file to include them like so:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-viewport-add-devices.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

To use them in your Storybook you'll need to make the following change:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-viewport-use-new-devices.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Once you start Storybook, you'll see your new viewports and devices.

If you need, you can also add these two to another list of viewports.

For instance, if you wanted to use these two with the minimal set of viewports, you can do it like so:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-merge-viewports.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

This will add both `Kindle Fire 2` and `Kindle Fire HD` to the list of devices. This is achieved by making use of the exported [`MINIMAL_VIEWPORTS`](https://github.com/storybookjs/storybook/blob/master/addons/viewport/src/defaults.ts#L135) property, by merging it with the new ones.

### Configuring per component or story

There are cases where it's not effective for you to use a certain visual viewport on a global scale and you need it to adjust it to a individual story.

You can change your story through [parameters](../writing-stories/parameters.md) to include the viewports you need to use for your component.

[Parameters](../writing-stories/parameters.md) can be configured for a whole set of stories or a single story via the standard parameter API:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/my-component-story-configure-viewports.js.mdx',
    'react/my-component-story-configure-viewports.mdx.mdx',
    'vue/my-component-story-configure-viewports.js.mdx',
    'angular/my-component-story-configure-viewports.ts.mdx',
    'web-components/my-component-story-configure-viewports.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Keyboard shortcuts

* Previous viewport: <kbd>shift</kbd> + <kbd>v</kbd>
* Next viewport: <kbd>v</kbd>
* Reset viewport: <kbd>alt</kbd> + <kbd>v</kbd>


These shortcuts can be edited in Storybook's Keyboard shortcuts page.