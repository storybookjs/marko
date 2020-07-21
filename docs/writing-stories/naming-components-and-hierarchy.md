---
title: 'Naming components and hierarchy'
---

The title of the component you export in the `default` export controls the name shown in the sidebar.

```js

// Button.stories.js
export default {
  title: ‘Button’
}
```

Yields this:

<div style="background-color:#F8FAFC">
TODO: per screenshot spreadsheet add image Default ordering of Button with the placement
<div>


### Grouping

It is also possible to group related components in an expandable interface in order to help with Storybook organization. To do so, use the `’/’` as a separator:

```js
// Button.stories.js

export default {
  title: ‘Design System/Atoms/Button’
}
```


```js
// Checkbox.stories.js

export default {
  title: ‘Design System/Atoms/Checkbox’
}
```

Yields this:

<div style="background-color:#F8FAFC">

TODO: per screenshot spreadsheet add image Show Button ordering/grouping with Design System/Atoms/Button title

<div>

### Roots

By default the top-level grouping will be displayed as a “root” in the UI (the all-caps, non expandable grouping in the screenshot above). If you prefer, you can [configure Storybook](../configure/user-interface#roots) to not show roots.

We recommend naming components according to the file hierarchy. 

### Sorting stories

By default, stories are sorted in the order in which they were imported. This can be overridden by adding `storySort` to the `options` parameters in your `preview.js` file.

The most powerful method of sorting is to provide a function to `storySort`. Any custom sorting can be achieved with this method.

```js
export const parameters = {
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
};
```

The `storySort` can also accept a configuration object.

```js

export parameters = {
  options: {
    storySort: {
      method: 'alphabetical', // Optional, defaults to 'configure'.
      order: ['Intro', 'Components'], // Optional, defaults to [].
      locales: 'en-US', // Optional, defaults to system locale.
    },
  },
};
```
<div>
TODO: ask tom/dom if we could add table here that could be further expanded
</div>

To sort your stories alphabetically, set `method` to `'alphabetical'` and optionally set the `locales` string. To sort your stories using a custom list, use the `order` array; stories that don't match an item in the `order` list will appear after the items in the list.

The `order` array can accept a nested array in order to sort 2nd-level story kinds. For example:

```js
export parameters = {
  options: {
    storySort: {
      order: ['Intro', 'Pages', ['Home', 'Login', 'Admin'], 'Components'],
    },
  },
};
```

Which would result in this story ordering:

1. `Intro` and then `Intro/*` stories
2. `Pages` story
3. `Pages/Home` and `Pages/Home/*` stories
4. `Pages/Login` and `Pages/Login/*` stories
5. `Pages/Admin` and `Pages/Admin/*` stories
6. `Pages/*` stories
7. `Components` and `Components/*` stories
8. All other stories

Note that the `order` option is independent of the `method` option; stories are sorted first by the `order` array and then by either the `method: 'alphabetical'` or the default `configure()` import order.
