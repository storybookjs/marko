---
title: 'Backgrounds'
---


<div style="background-color:#F8FAFC">
TODO: CLEANUP comments once this is vetted.
</div>

The backgrounds toolbar item allows you to adjust the background that your story is rendered on via Storybook’s UI:

<div style="background-color:#F8FAFC">
TODO: add Gif mentioned in the SB 6.0 needs to be further vetted
</div>

## Configuration

By default the background toolbar presents you with either a light and a dark background.

But you're not restricted to these two, you can configure your own set of colors with the `parameters.backgrounds` [parameter](../writing-stories/parameters) in your [`.storybook/preview.js`](../configure/overview#configure-story-rendering):

```js
//.storybook/preview.js

export const parameters = {
backgrounds: {
    default: 'twitter',
    values: [
        { 
            name: 'twitter', 
            value: '#00aced'
        },
        { 
            name: 'facebook', 
            value: '#3b5998' 
        },
      ],
    }
```

You can also set backgrounds on per-story or per-component basis by using [parameter inheritance](../writing-stories/parameters#component-parameters):

```js
// Button.stories.js

// To apply a set of backgrounds to all stories of Button:
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
```

You can also only override a single key on the background parameter, for instance to set a different default value for a single story:

```js
// Button.stories.js

export const Large = ButtonStory.bind({});
Large.parameters = {
  backgrounds: { default: 'facebook' }
};
```

If you want to disable backgrounds in a story, you can do so by setting the `backgrounds` parameter like so:

<!-- If you don't want to use backgrounds for a story, you can set the `backgrounds` parameter to `{ disable: true }` to skip the addon: -->

```js
// Button.stories.js

export const Large = ButtonStory.bind({});
Large.parameters = {
  backgrounds: { disable: true }
};
```

