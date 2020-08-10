---
title: 'Backgrounds'
---

The backgrounds toolbar item allows you to adjust the background that your story is rendered on via Storybook’s UI:

<video autoPlay muted playsInline loop>
  <source
    src="addon-backgrounds-optimized.mp4"
    type="video/mp4"
  />
</video>

### Configuration

By default, the background toolbar presents you with a light and dark background.

But you're not restricted to these two backgrounds, you can configure your own set of colors with the `parameters.backgrounds` [parameter](../writing-stories/parameters.md) in your [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-configure-background-colors.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

You can also set backgrounds on per-story or per-component basis by using [parameter inheritance](../writing-stories/parameters.md#component-parameters):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-configure-backgrounds.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

You can also only override a single key on the background parameter, for instance to set a different default value for a single story:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-override-background-color.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

If you want to disable backgrounds in a story, you can do so by setting the `backgrounds` parameter like so:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-disable-backgrounds.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

