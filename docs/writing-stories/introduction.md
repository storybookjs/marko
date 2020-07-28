---
title: 'Introduction'
---

**A story captures the rendered state of a UI component**. It’s a function that returns a component’s state given a set of arguments. 

Storybook uses the generic term arguments (args for short) when talking about React’s `props`, Vue’s `slots`, Angular’s `@input`, and other similar concepts.

### Where to put stories

A component’s stories are defined in a story file that lives alongside the component file. The story file is for development-only, it won't be included in your production bundle.

```
Button.js | ts
Button.stories.js | ts
```

### Component Story Format

We define stories according to the Component Story Format (CSF), an ES6 module-based standard that is portable between tools and easy to write. 

The key ingredients are the **`default` export** that describes the component, and **named exports** that describe the stories.

#### Default export

The default export metadata controls how Storybook lists your stories and provides information used by addons. For example, here’s the default export for a story file `Button.stories.js`:

```js
// Button.stories.js

import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
}
```

#### Defining stories

Use the named exports of a CSF file to define your component’s stories. Here’s how to render `Button` in the “primary” state and export a story called `Primary`.

```js
// Button.stories.js

import { Button } from './Button';
export default {
  title: 'Components/YourComponent',
  component: YourComponent,
}
export const Primary = () => <Button primary label="Button" />;

```

### How to write stories

A story is a function that describes how to render a component. You can have multiple stories per component. The simplest way to create stories is to render a component with different arguments multiple times.

```js
// Button.stories.js

export const Primary = () => <Button background="#ff0" label="Button" />;
export const Secondary = () => <Button background="#ff0" label=”😄👍😍💯" />;
export const Tertiary = () => <Button background="#ff0" label="📚📕📈🤓" />;

```

This is straightforward for components with few stories, but can be repetitive with many stories. 

#### Using args

Refine this pattern by defining a master template for a component’s stories that allows you to pass in `args`. This reduces the unique code you’ll need to write and maintain for each story.

```js
// We create a “template” of how args map to rendering
const Template = (args) => <Button {...args} />;

// Each story then reuses that template
export const Primary = Template.bind({});
Primary.args = { background="#ff0",  label: 'Button' };
export const Secondary = Template.bind({});
Secondary.args = {  ...Primary.args,  label: '😄👍😍💯',};

export const Tertiary = Template.bind({});
Tertiary.args = {  ...Primary.args,  label: '📚📕📈🤓',};
```

The template is reused across stories. Template.bind({}) makes a copy of the function which reduces code duplication. Similarly,`...Primary.args` makes a copy of the data, reducing data duplication.

What’s more, you can import args to reuse when writing stories for other components. This is useful when you’re building composite components. For example, if we make a `ButtonGroup`component, we might remix two `Button` stories.

```js
// ButtonGroup.stories.js

import { ButtonGroup } from '../ButtonGroup';
import { Primary, Secondary } from '../Button.stories';
export default {
  title: 'ButtonGroup',
  component: ButtonGroup,
}
const Template = (args) => <ButtonGroup {...args} />

export const Pair = Template.bind({});
Pair.args = {
  buttons: [ Primary.args, Secondary.args ],
  orientation: 'horizontal',
};
```
When Button’s signature changes, you only need to change Button’s stories to reflect the new schema. ButtonGroup’s stories will automatically be updated. This pattern allows you to reuse your data definitions up and down your component hierarchy, making your stories more maintainable.

That’s not all! Each of the args from the story function are live editable using Storybook’s [controls](../essentials/controls) panel. This means your team can dynamically change components in Storybook to stress test and find edge cases.

<video autoPlay muted playsInline loop>
  <source
    src="addon-controls-demo-optimized.mp4"
    type="video/mp4"
  />
</video>

Addons can enhance args. For instance, [Actions](../essentials/actions) auto detects which args are callbacks and appends a logging function to them. That way interactions (like clicks) get logged in the actions panel.

<video autoPlay muted playsInline loop>
  <source
    src="addon-actions-demo-optimized.mp4"
    type="video/mp4"
  />
</video>

#### Using parameters

Parameters are Storybook’s method of defining static metadata for stories. A story’s parameters can be used to provide configuration to various addons at the level of a story or group of stories.

For instance, suppose you wanted to test your Button component against a different set of backgrounds than the other components in your app. You might add a component-level `backgrounds` parameter:

```js
// Button.stories.js

import Button from './Button';
export default {
  title: 'Button',
  component: Button,
  parameters: {
    backgrounds: {
      values: [
         { name: 'red', value: '#f00', },
         { name: 'green', value: '#0f0', },
         { name: 'blue', value: '#00f', },
      ]
    }
  }
}
```

![Background colors parameter](./parameters-background-colors.png)

This parameter would instruct the backgrounds addon to reconfigure itself whenever a Button story is selected. Most addons are configured via a parameter-based API and can be influenced at a [global](./parameters#global-parameters), [component](./parameters#component-parameters) and [story](./parameters#story-parameters) level.


#### Using decorators

Decorators are a mechanism to wrap a component in arbitrary markup when rendering a story. Components are often created with assumptions about ‘where’ they render. Your styles might expect a theme or layout wrapper. Or your UI might expect certain context or data providers.

A simple example is adding padding to a component’s stories. Accomplish this using a decorator that wraps the stories in a `div` with padding, like so:

```js
// Button.stories.js

import Button from './Button';
export default {
  title: 'Button',
  component: Button,
  decorators: [(Story) => <div style={{ padding: '3em' }}><Story /></div>]
}
```

Decorators [can be more complex](./decorators#context-for-mocking) and are often provided by [addons](../configure/user-interface#storybook-addons). You can also configure decorators at the [story](./decorators#story-decorators), [component](./decorators#component-decorators) and [global](./decorators#global-decorators) level.


### Stories for two or more components

When building design systems or component libraries, you may have two or more components that are designed to work together. For instance, if you have a parent `List` component, it may require child `ListItem` components.

```js
import List from './List'
export default {
  component: List,
  title: 'List',
};

// Always an empty list, not super interesting
const Template = (args) => <List {...args} />
```

In such cases, it makes sense to render something a different function for each story:

```js
import List from './List'
import ListItem from './ListItem'
export default {
  component: List,
  title: 'List',
};

export const Empty = (args) => <List {...args} />;

export const OneItem = (args) => (
  <List {...args}>
    <ListItem />
  </List>
);

export const ManyItems = (args) => (
  <List {...args}>
    <ListItem />
    <ListItem />
    <ListItem />
  </List>
);
```

You can also reuse stories from the child `ListItem` in your `List` component. That’s easier to maintain because you don’t have to keep the identical story definitions up to date in multiple places.

```js
import { Selected, Unselected } from './ListItem.stories';
export const ManyItems = (args) => (
  <List {...args}>
    <Selected {...Selected.args} />
    <Unselected {...Unselected.args} />
    <Unselected {...Unselected.args} />
  </List>
);
```

> Note that there are disadvantages in writing stories like this as you cannot take full advantage of the args mechanism and composing args as you build more complex composite components. For more discussion, set the [multi component stories](../workflows/stories-for-multiple-components) workflow article.

