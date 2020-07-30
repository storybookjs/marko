---
title: 'Story rendering'
---

In Storybook, your stories render in a special “preview” iframe (Canvas tab) inside the larger Storybook web application. The JavaScript build configuration of the preview is controlled by a [webpack](./integration#default-configuration) config, but you also may want to directly control the HTML that is rendered to help your stories render correctly.


### Adding to &#60;head&#62;

If you need to add extra elements to the `head` of the preview iframe, for instance to load static stylesheets, font files, or similar, you can create a file called [`.storybook/preview-head.html`](./overview#configure-story-rendering) and add tags like this:

```html
<!--  .storybook/preview-head.html -->

<!-- Pull in static files served from your Static director or the internet -->
<link rel=”preload” href=”your/font” />
<!-- Or you can load custom head-tag JavaScript: -->
<script src="https://use.typekit.net/xxxyyy.js"></script>
<script>try{ Typekit.load(); } catch(e){ }</script>
```

<div class="aside">

Storybook will inject these tags into the _preview iframe_ where your components are rendered not the Storybook application UI.

</div>

### Adding to &#60;body&#62;

Sometimes, you may need to add different tags to the `<body>`. This is useful for adding some custom content roots.

You can accomplish this by creating a file called `preview-body.html` inside your `.storybook` directory and add tags like this:

```html
<!--  .storybook/preview-body.html -->
<div id="custom-root"></div>
```

If using relative sizing in your project (like `rem` or `em`), you may update the base `font-size` by adding a `style` tag to `preview-body.html`:

```html
<style>
  body {
    font-size: 15px;
  }
</style>
```

<div class="aside">

Storybook will inject these tags into the _preview iframe_ where your components are rendered not the Storybook application UI.

</div>

