---
title: 'MDX Format'
---

### MDX format

`MDX` is the syntax [Storybook Docs](../writing-docs/introduction.md) uses to capture long-form Markdown documentation and stories in one file. You can also write pure documentation pages in `MDX` and add them to Storybook alongside your stories. [Read the announcement](https://medium.com/storybookjs/rich-docs-with-storybook-mdx-61bc145ae7bc) to learn more about how and why it came to be.

#### Basic example

Let's get started with an example that combines Markdown with a single story:

```js
import { Meta, Story, Preview } from '@storybook/addon-docs/blocks';
import { Checkbox } from './Checkbox';

<Meta title="MDX/Checkbox" component={Checkbox} />

# Checkbox

With `MDX` we can define a story for `Checkbox` right in the middle of our Markdown documentation.

<Preview>
  <Story name="all checkboxes">
    <form>
      <Checkbox id="Unchecked" label="Unchecked" />
      <Checkbox id="Checked" label="Checked" checked />
      <Checkbox appearance="secondary" id="second" label="Secondary" checked />
    </form>
  </Story>
</Preview>
```
And here's how that's rendered in Storybook:

![Show a simple mdx example](./mdx-simple.png)

As you can see there's a lot going on here. We're writing Markdown, we're writing JSX, and somehow we're also defining Storybook stories that are drop-in compatible with the entire Storybook ecosystem.

Let's break it down.

#### MDX-Flavored CSF

[MDX](https://mdxjs.com/) is a standard file format that combines Markdown with JSX. This means you can use Markdown’s terse syntax (such as `# heading`) for your documentation, and freely embed JSX component blocks at any point in the file.

MDX-flavored [Component Story Format (CSF)](https://medium.com/storybookjs/component-story-format-66f4c32366df) includes a collection of components called **"Doc Blocks"**, that allow Storybook to translate MDX files into storybook stories. MDX-defined stories are identical to regular Storybook stories, so they can be used with Storybook's entire ecosystem of addons and view layers.

For example, here's the story from `Checkbox` example above, rewritten in CSF:

```js
import React from 'react';
import { Checkbox } from './Checkbox';
export default { title: "MDX/Checkbox" component: Checkbox };
export const allCheckboxes = () => (
  <form>
    <Checkbox id="Unchecked" label="Unchecked" />
    <Checkbox id="Checked" label="Checked" checked />
    <Checkbox appearance="secondary" id="second" label="Secondary" checked />
  </form>
);
```

There's a one-to-one mapping from the code in `MDX` to `CSF`, which in turn directly corresponds to Storybook's internal `storiesOf` API. As a user, this means your existing Storybook knowledge should translate between the three. And technically, this means that the transformations that happen under the hood are simple and predictable.

#### Writing stories

Now let's look at a more realistic example to see a few more things we can do:

```js
import { Meta, Story, Preview } from '@storybook/addon-docs/blocks';

import { Badge } from './Badge';
import { Icon } from './Icon';

<Meta title="MDX/Badge" component={Badge} />

# Badge

Let's define a story for our `Badge` component:

<Story name="positive">
  <Badge status="positive">Positive</Badge>
</Story>

We can drop it in a `Preview` to get a code snippet:

<Preview>
  <Story name="negative">
    <Badge status="negative">Negative</Badge>
  </Story>
</Preview>

We can even preview multiple stories in a block. This
gets rendered as a group, but defines individual stories
with unique URLs and isolated snapshot tests.

<Preview>
  <Story name="warning">
    <Badge status="warning">Warning</Badge>
  </Story>
  <Story name="neutral">
    <Badge status="neutral">Neutral</Badge>
  </Story>
  <Story name="error">
    <Badge status="error">Error</Badge>
  </Story>
  <Story name="with icon">
    <Badge status="warning">
      <Icon icon="check" inline />
      with icon
    </Badge>
  </Story>
</Preview>
```

And here's how that gets rendered in Storybook:

![Display mdx page](./mdx-page.png)

## Embedding stories

Suppose you have an existing story and want to embed it into your docs. Here's how to show a story with ID `some--id` (check the browser URL in Storybook v5+ to see a story's ID):

```js
import { Story } from "@storybook/addon-docs/blocks";

# Some header

And Markdown here

<Story id="some--id" />
```

You can also use the rest of the MDX features in conjunction with embedding. That includes source, preview, and prop tables.

## Decorators and parameters

To add [decorators](../writing-docs/mdx.md#decorators-and-parameters) and [parameters](../writing-docs/mdx.md#decorators-and-parameters) in MDX:

```js
<Meta
  title='MyComponent'
  decorators={[ ... ]}
  parameters={{ ... }}
/>

<Story name="story" decorators={[ ... ]} parameters={{ ... }} >
...
</Story>
```

In addition, global decorators work just like before, e.g. adding the following to your [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering):

```js
// .storybook/preview.js
import { addDecorator, addParameters } from '@storybook/react';

addDecorator(...);
addParameters({ ... });
```

#### Documentation-only MDX

Typically, when you use Storybook MDX, you define stories in the MDX documentation is automatically associated with those stories. But what if you want to write Markdown-style documentation and have it show up in your Storybook?

If you don't define stories in your MDX, you can write MDX documentation and associate it with an existing story, or embed that MDX as its own documentation node in your Storybook's navigation.

If you don't define a `Meta`, you can write Markdown and associate with an existing story. See ["CSF Stories with MDX Docs"](../writing-docs/mdx.md).

To get a "documentation-only story", in your UI, define a `<Meta>` as you normally would, but don't define any stories. It will show up in your UI as a documentation node:


![Show documentation](./mdx-documentation-only.png)


## MDX file names

Unless you use a custom webpack configuration, all of your `MDX` files should have the suffix `*.stories.mdx`. This tells Storybook to apply its special processing to the `<Meta>` and `<Story>` elements in the file.

Be sure to update your Storybook config file to load `.stories.mdx` stories, as per the [`addon-docs` installation instructions](https://github.com/storybookjs/storybook/tree/master/addons/docs#installation).

### ArgTypes

<div class="aside">

NOTE: This API is experimental and may change outside of the typical semver release cycle

<div>


ArgTypes are a first-class feature in Storybook for specifying the behaviour of [Args](../writing-stories/args.md). By specifying the type of an arg you constrain the values that it can take and can also provide information about args that are not explicitly set (i.e. not required).

You can also use argTypes to “annotate” args with information that is used by addons that make use of those args, for instance to instruct the controls addons to render a color choose for a string-valued arg.

The most concrete realization of argTypes is the [Args Table](../writing-docs/doc-blocks.md#argstable) doc block. Each row in the table corresponds to a single argType, as well as the current value of that arg.

![Storybook infering automatically the argType](./argstable.png)

## Automatic argType inference

If you are using the Storybook [docs](../writing-docs/introduction.md) addon (installed by default as part of [essentials](../essentials/introduction.md)), then Storybook will infer a set of argTypes for each story based on the `component` specified in the [default export](#default-export) of the CSF file. 

To do so, Storybook uses various static analysis tools depending on your framework.



- React 
    - [react-docgen](https://github.com/reactjs/react-docgen)
    - [react-docgen-typescript](https://github.com/styleguidist/react-docgen-typescript)
- Vue
    - [vue-docgen-api](https://github.com/vue-styleguidist/vue-styleguidist/tree/dev/packages/vue-docgen-api)
- Angular
    - [compodoc](https://compodoc.app/)
- WebComponents
    - [custom-element.json](https://github.com/webcomponents/custom-elements-json)
- Ember
    - [YUI doc](https://github.com/ember-learn/ember-cli-addon-docs-yuidoc#documenting-components)

The format of the generated argType will look something like:

```js
const argTypes = {
  label: {
    name: 'label',
    type: { name: 'string', required: false },
    defaultValue: 'Hello',
    description: 'demo description',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'Hello' },
    }
    control: {
      type: 'text'
    }
  }
}
```

In this ArgTypes data structure, name, type, defaultValue, and description are standard fields in all ArgTypes (analogous to PropTypes in React). The table and control fields are addon-specific annotations. So, for example, the table annotation provides extra information to customize how label gets rendered, and the control annotation provides extra information for the control for editing the property.

<div class="aside">

 `@storybook/addon-docs` provide shorthand for common tasks:
- `type: 'number'` is shorthand for type: { name: 'number' }
- `control: 'radio'` is shorthand for control: { type: 'radio' }

<div>

#### Manual specification

If you want more control over the props table or any other aspect of using argTypes, you can overwrite the generated argTypes for you component on a per-arg basis. For instance, with the above inferred argTypes and the following default export: 

```js

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    label: {
      description: 'overwritten description',
      table: {
        type: { summary: 'something short', detail: 'something really really long' },
      },
      control: {
        type: null,
      },
    },
  },
};
```

These values--description, table.type, and controls.type--get merged over the defaults that are extracted by Storybook. The final merged values would be:

```js
const argTypes = {
  label: {
    name: 'label',
    type: { name: 'string', required: false },
    defaultValue: 'Hello',
    description: 'overwritten description',
    table: {
      type: { summary: 'something short', detail: 'something really really long' },
      defaultValue: { summary: 'Hello' },
    }
    control: {
      type: null
    }
  }
}
```

In particular, this would render a row with a modified description, a type display with a dropdown that shows the detail, and no control.

#### Using argTypes in addons

If you want to access the argTypes of the current component inside an addon, you can use the `useArgTypes` hook from the `@storybook/api` package:

```js
import { useArgTypes } from '@storybook/api';

// inside your panel
const { argTypes } = useArgTypes();
```