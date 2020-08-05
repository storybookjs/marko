---
title: 'MDX'
---

MDX is a [standard file format](https://mdxjs.com/) that combines Markdown with JSX. This means you can use Markdown’s terse syntax (such as # heading) for your documentation, write stories that compile to our component story format, and freely embed JSX component blocks at any point in the file. All at once.

In addition, you can write pure documentation pages in MDX and add them to Storybook alongside your stories.

![MDX simple example result](./mdx-hero.png)


### Basic example

Let's get started with an example that combines Markdown with a single story:

```js
// Checkbox.stories.mdx

import { Meta, Story, Preview } from '@storybook/addon-docs/blocks';
import { Checkbox } from './Checkbox';

<Meta title="MDX/Checkbox" component={Checkbox} />

# Checkbox

With `MDX` we can define a story for `Checkbox` right in the middle of our
Markdown documentation.

export const Template = (args) => <Checkbox {...args} />
<Preview>
  <Story name="Unchecked" args={{ 
      label: 'Unchecked'
    }}>
    {Template.bind({})}
   </Story>
  <Story name="Checked" args={{ 
      label: 'Unchecked', 
      checked: true 
    }}>
    {Template.bind({})}
   </Story>
  <Story name="Secondary" args={{
    label: 'Secondary', 
    checked: true, 
    appearance: 'secondary'
  }}>
    {Template.bind({})}
   </Story>
</Preview>
```
And here's how that's rendered in Storybook:

![MDX simple example result](./mdx-simple.png)

As you can see there's a lot going on here. We're writing Markdown, we're writing JSX, and we're also defining Storybook stories that are drop-in compatible with the entire Storybook ecosystem.

Let's break it down.

### MDX-flavored CSF

MDX-flavored [Component Story Format (CSF)](../api/csf.md) includes a collection of components called ["Doc Blocks"](./doc-blocks.md), that allow Storybook to translate MDX files into Storybook stories. MDX-defined stories are identical to regular Storybook stories, so they can be used with Storybook's entire ecosystem of addons and view layers.

For example, here's the first story from the Checkbox example above, rewritten in CSF:

```js
// Checkbox.stories.js

import React from 'react';
import { Checkbox } from './Checkbox';

export default { 
    title: "MDX/Checkbox", 
    component: Checkbox
};
const Template = (args) => <Checkbox {...args} />

export const Unchecked = Template.bind({});
Unchecked.args = { label: 'Unchecked' };
```

There's a one-to-one mapping from the code in MDX to CSF. As a user, this means your existing Storybook knowledge should translate between the two.

### Writing stories

Let's look at a more realistic example to see how MDX works:

```js
// Badge.stories.mdx

import { Meta, Story, Preview } from '@storybook/addon-docs/blocks';

import { Badge } from './Badge';
import { Icon } from './Icon';

<Meta title="MDX/Badge" component={Badge} />
export const Template = (args) => <Badge {...args } />

# Badge

Let's define a story for our `Badge` component:

<Story name="positive" args={{
    status: 'positive', 
    label: 'Positive' 
}}>
  {Template.bind({})}
</Story>

We can drop it in a `Preview` to get a code snippet:

<Preview>
  <Story name="negative" args={{
      status: 'negative', 
      label: 'Negative'
  }}>
    {Template.bind({})}
  </Story>
</Preview>

We can even preview multiple Stories in a block. This
gets rendered as a group, but defines individual stories
with unique URLs which is great for review and testing.

<Preview>
  <Story name="warning" args={{
      status: warning,
      label: 'Warning' 
  }}>
    {Template.bind({})}
  </Story>
  <Story name="neutral" args={{
      status: 'neutral', 
      label: 'Neutral' 
  }}>
    {Template.bind({})}
  </Story>
  <Story name="error" args={{
      status: 'error', 
      label: 'Error' 
  }}>
    {Template.bind({})}
  </Story>
  <Story name="with icon" args={{
    status: warning, 
    label: (<Icon icon="check" inline /> with icon)
  )}}>
    {Template.bind({})}
  </Story>
</Story>
</Preview>
```

And here's how that gets rendered in Storybook:

![MDX page](./mdx-page.png)


### Embedding stories

Suppose you have an existing story and want to embed it into your docs. Here's how to show a story with ID some--id. Check the browser URL in Storybook v5+ to find a story's ID.

```js

import { Story } from "@storybook/addon-docs/blocks";

# Some header

And Markdown here

<Story id="some--id" />
```

You can also use the rest of the MDX features in conjunction with embedding. That includes source, preview, and prop tables.

### Decorators and parameters

To add decorators and parameters in MDX:

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

Global parameters and decorators work just like before.

### Documentation-only MDX

Typically, when you use Storybook MDX, you define stories in the MDX and documentation is automatically associated with those stories. But what if you want to write Markdown-style documentation without any stories inside?

If you don't define stories in your MDX, you can write MDX documentation and associate it with an existing story, or embed that MDX as its own documentation node in your Storybook's navigation.

If you don't define a Meta, you can write Markdown and associate with an existing story. See ["CSF Stories with MDX Docs"](https://github.com/storybookjs/storybook/blob/master/addons/docs/docs/recipes.md#csf-stories-with-mdx-docs).

To get a "documentation-only story", in your UI, define a `<Meta>` as you normally would, but don't define any stories. It will show up in your UI as a documentation node:

![MDX docs only story](./mdx-documentation-only.png)

### MDX file names

Unless you use a custom [webpack configuration](../configure/integration.md#extending-storybooks-webpack-config), all of your MDX files should have the suffix `*.stories.mdx`. This tells Storybook to apply its special processing to the `<Meta>` and `<Story>` elements in the file.

<div class="aside">

Be sure to update [.storybook/main.js](../configure/overview.md#configure-story-rendering) file to load `.stories.mdx` stories, as per the addon-docs installation instructions.

</div>