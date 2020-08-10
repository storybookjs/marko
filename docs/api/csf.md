---
title: 'Component Story Format (CSF)'
---

Storybook's Component Story Format (CSF) is the recommended way to [write stories](../writing-stories/introduction.md) since Storybook 5.2. [Read the announcement](https://medium.com/storybookjs/component-story-format-66f4c32366df) to learn more about how it came to be.

<div class="aside">

If you are writing stories in the older `storiesOf()` syntax, you can find documentation in an [advanced README](../../lib/core/docs/storiesOf.md).

</div>

In CSF, stories and component metadata are defined as ES Modules. Every component story file consists of a required **default export** and one or more **named exports**.

CSF is supported in all frameworks except React Native, where you should use the [storiesOf API](./storiesof.md) instead.

## Default export

The default export defines metadata about your component, including the `component` itself, its `title` (where it will show up in the [navigation UI story hierarchy](../writing-stories/docs/writing-stories/naming-components-and-hierarchy.md#sorting-stories)), [decorators](../writing-stories/decorators.md), and [parameters](../writing-stories/parameters.md).

The `component` field is optional (but encouraged!), and is used by addons for automatic prop table generation and display of other component metadata. `title` should be unique, i.e. not re-used across files.

```js
// MyComponent.story.js
import MyComponent from './MyComponent';

export default {
  title: 'Path/To/MyComponent',
  component: MyComponent,
  decorators: [ ... ],
  parameters: { ... }
}
```

For more examples, see [writing stories](../writing-stories/introduction.md).

## Named story exports

With CSF, every named export in the file represents a story function by default.

```js
// MyComponent.story.js
import MyComponent from './MyComponent';

export default {
  title: 'Path/To/MyComponent',
  component: MyComponent,
};

export const Basic = () => <MyComponent />;
export const WithProp = () => <MyComponent prop="value" />;
```

The exported identifiers will be converted to "start case" using Lodash's [startCase](https://lodash.com/docs/#startCase) function. For example:

| Identifier           |    Transformation    |
| -------------------- | :------------------: |
| **name**             |       **Name**       |
| **someName**         |    **Some Name**     |
| **someNAME**         |    **SSome NAME**    |
| **some_custom_NAME** | **Some Custom NAME** |
| **someName1234**     | **ome Name 1 2 3 4** |

It's recommended to start export names with a capital letter.

Story functions can be annotated with a few different fields to define story-level [decorators](../writing-stories/decorators.md) and [parameters](../writing-stories/parameters.md), and also to define the `storyName` of the story.

The `storyName` is useful if you want to use names with special characters, names that correspond to restricted keywords in Javascript, or names that collide with other variables in the file. If it's not specified, the export name will be used instead.

```jsx
// MyComponent.story.js

export const Simple = () => <MyComponent />;

Simple.storyName = 'So simple!';
Simple.decorators = [ ... ];
Simple.parameters = { ... };
```

## Args story inputs

Starting in SB 6.0, stories accept named inputs called Args. Args are dynamic data that are provided (and possibly updated by) Storybook and its addons.

Consider Storybook’s ["Button" example](../writing-stories/introduction.md#defining-stories) of a text button that logs its click events:

```js
// Button.story.js

import { action } from '@storybook/addon-actions';
import { Button } from './Button';

export default {
    title: 'Button',
    component: Button
};
export const Text = () => <Button label=’Hello’ onClick={action('clicked')} />;
```

Now consider the same example, re-written with args:

```js
export const Text = ({ label, onClick }) => <Button label={label} onClick={onClick} />;
Text.args = {
  label: 'Hello',
  onClick: action('clicked'),
};
```

At first blush this might seem no better than the original example. However, if we add the [Docs addon](https://github.com/storybookjs/storybook/tree/master/addons/docs) and configure the [Actions addon](https://github.com/storybookjs/storybook/tree/master/addons/actions) appropriately, we can write:

```js
export const Text = ({ label, onClick }) => <Button label={label} onClick={onClick} />;
```

Or even more simply:

```js
export const Text = (args) => <Button {...args} />;
```

Not only are these versions shorter and easier to write than their no-args counterparts, but they are also more portable since the code doesn't depend on the actions addon specifically.

For more information on setting up [Docs](../writing-docs/introduction.md) and [Actions](../essentials/actions.md), see their respective documentation.

## Storybook export vs name handling

Storybook handles named exports and `story.name` slightly differently. When should you use one vs. the other?

The named export is always used to determine the story ID / URL.

If you specify `story.name`, it will be used as the story display name in the UI.

If you don't specify `story.name`, the named export will be used to generate the display name. Storybook passes the named export through a `storyNameFromExport` function, which is implemented with `lodash.startCase`:

```js
it('should format CSF exports with sensible defaults', () => {
  const testCases = {
    name: 'Name',
    someName: 'Some Name',
    someNAME: 'Some NAME',
    some_custom_NAME: 'Some Custom NAME',
    someName1234: 'Some Name 1234',
    someName1_2_3_4: 'Some Name 1 2 3 4',
  };
  Object.entries(testCases).forEach(([key, val]) => {
    expect(storyNameFromExport(key)).toBe(val);
  });
});
```

When you want to change the name of your story, just rename the CSF export. This will change the name of the story and also change the story's ID and URL.

You should use the `story.name` option in the following cases:

1. You want the name to show up in the Storybook UI in a way that's not possible with a named export, e.g. reserved keywords like "default", special characters like emoji, spacing/capitalization other than what's provided by `storyNameFromExport`.
2. You want to preserve the Story ID independently from changing how it's displayed. Having stable Story ID's is useful for integration with third party tools.

## Non-story exports

In some cases, you may want to export a mixture of story and non-stories. For example, it can be useful to export data that's used in your stories.

To make this possible, you can use optional `includeStories` and `excludeStories` configuration fields in the default export, which can be set to either an array of strings, or a regular expression.

Consider the following story file:

```js
// MyComponent.story.js

import React from 'react';
import MyComponent from './MyComponent';
import someData from './data.json';

export default {
  title: 'MyComponent',
  component: MyComponent,
  includeStories: ['SimpleStory', 'ComplexStory']
}

export const simpleData = { foo: 1, bar: 'baz' };
export const complexData = { foo: 1, { bar: 'baz', baz: someData }};

export const SimpleStory = () => <MyComponent data={simpleData} />;
export const ComplexStory = () => <MyComponent data={complexData} />;
```

When Storybook loads this file, it will see all the exports, but it will ignore the data exports and only treat `SimpleStory` and `ComplexStory` as stories.

For this specific example the equivalent result can be achieved in a few ways depending on what's convenient:

- `includeStories: ['SimpleStory', 'ComplexStory']`
- `includeStories: /.*Story$/`
- `excludeStories: ['simpleData', 'complexData']`
- `excludeStories: /.*Data$/`
