---
id: 'add-custom-body'
title: 'Add Custom Body'
---

Sometimes, you may need to add different tags to the HTML body. This is useful for adding some custom content roots.

You can accomplish this by creating a file called `preview-body.html` inside the Storybook config directory and add tags like this:

```html
<div id="my-additional-root"></div>
```

If using relative sizing in your project (like `rem` or `em`), you may update the base `font-size` by adding a `style` tag to `preview-body.html`:

```html
<style>
  body {
    font-size: 15px;
  }
</style>
```

That’s it. Storybook will inject these tags to the html body. It is also possible to use [environment variables](https://storybook.js.org/docs/configurations/env-vars/#usage-in-custom-headbody).

> **Important**
>
> Storybook will inject these tags to the iframe where your components are rendered. So, these won’t be loaded into the main Storybook UI. Stories are rendered into a div with ID `#main`, regardless of what custom content is added to the page.
