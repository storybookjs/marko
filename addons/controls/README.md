<center>
  <img src="https://raw.githubusercontent.com/storybookjs/storybook/next/addons/controls/docs/media/addon-controls-hero.gif" width="80%" />
</center>

<h1>Storybook Controls</h1>

Storybook Controls gives you UI to interact with a component's inputs dynamically, without needing to code. It creates an addon panel next to your component examples ("stories"), so you can edit them live.

It does not require any modification to your components, and stories for controls are:

- **Convenient.** Auto-generate controls based on [React/Vue/Angular/etc.](#framework-support) components.
- **Portable.** Reuse your interactive stories in documentation, tests, and even in designs.
- **Rich.** Customize the controls and interactive data to suit your exact needs.

Controls are built on top of [Storybook Args](https://github.com/storybookjs/storybook/blob/next/docs/src/pages/formats/component-story-format/index.md#args-story-inputs), which is an open, standards-based format that enable stories to be reused in a variety of contexts.

- **Documentation.** 100% compatible with [Storybook Docs](https://github.com/storybookjs/storybook/tree/next/addons/docs).
- **Testing.** Import stories directly into your [Jest](https://jestjs.io/) tests.
- **Ecosystem.** Reuse stories in design/development tools that support it.

Controls replaces [Storybook Knobs](https://github.com/storybookjs/storybook/tree/master/addons/knobs). It incorporates lessons from years of supporting Knobs on tens of thousands of projects and dozens of different frameworks. We couldn't incrementally fix knobs, so we built a better version.

<h2>Contents</h2>

- [Installation](#installation)
- [Writing stories](#writing-stories)
  - [Getting started](#getting-started)
  - [Auto-generated args](#auto-generated-args)
  - [Custom controls args](#custom-controls-args)
  - [Fully custom args](#fully-custom-args)
    - [Angular](#angular)
  - [Template stories](#template-stories)
- [Configuration](#configuration)
  - [Control annotations](#control-annotations)
  - [Parameters](#parameters)
    - [Expanded: show property documentation](#expanded-show-property-documentation)
    - [Hide NoControls warning](#hide-nocontrols-warning)
- [Framework support](#framework-support)
- [FAQs](#faqs)
  - [How will this replace addon-knobs?](#how-will-this-replace-addon-knobs)
  - [How do I migrate from addon-knobs?](#how-do-i-migrate-from-addon-knobs)
  - [My controls aren't being auto-generated. What should I do?](#my-controls-arent-being-auto-generated-what-should-i-do)
  - [How can I disable controls for certain fields on a particular story?](#how-can-i-disable-controls-for-certain-fields-on-a-particular-story)
  - [How do controls work with MDX?](#how-do-controls-work-with-mdx)

## Installation

Controls requires [Storybook Docs](https://github.com/storybookjs/storybook/tree/next/addons/docs). If you're not using it already, please install that first.

Next, install the package:

```sh
npm install @storybook/addon-controls -D # or yarn
```

And add it to your `.storybook/main.js` config:

```js
module.exports = {
  addons: [
    '@storybook/addon-docs'
    '@storybook/addon-controls'
  ],
};
```

## Writing stories

Let's see how to write stories that automatically generate controls based on your component properties.

Controls is built on [Storybook Args](https://github.com/storybookjs/storybook/blob/next/docs/src/pages/formats/component-story-format/index.md#args-story-inputs), which is a small, backwards-compatible change to Storybook's [Component Story Format](https://medium.com/storybookjs/component-story-format-66f4c32366df).

This section is a step-by-step walkthrough for how to upgrade your stories. It takes you from a starting point of the traditional "no args" stories, to auto-generated args, to auto-generated args with custom controls, to fully custom args if you need them.

### Getting started

Let's start with the following component/story combination, which should look familiar if you're coming from an older version of Storybook.

```tsx
import React from 'react';
interface ButtonProps {
  /** The main label of the button */
  label?: string;
}
export const Button = ({ label = 'FIXME' }: ButtonProps) => <button>{label}</button>;
```

And here's a story that shows that Button component:

```jsx
import React from 'react';
import { Button } from './Button';
export default { title: 'Button', component: Button };

export const Basic = () => <Button label="hello" />;
```

After installing the controls addon, you'll see a new tab that shows the component's props, but it doesn't show controls because the story doesn't use args. That's not very useful, but we'll fix that momentarily.

<center>
  <img src="https://raw.githubusercontent.com/storybookjs/storybook/next/addons/controls/docs/media/addon-controls-install.png" width="80%" />
</center>

### Auto-generated args

To upgrade your story to an Args story, modify it to accept an args object. **NOTE:** you may need to refresh the browser at this point.

```jsx
export const Basic = (args) => {
  console.log({ args });
  return <Button label="hello" />;
};
```

Now you'll see auto-generated controls in the `Controls` tab, and you can see the `args` data updating as you edit the values in the UI:

<center>
  <img src="https://raw.githubusercontent.com/storybookjs/storybook/next/addons/controls/docs/media/addon-controls-args-logging.png" width="80%" />
</center>

Since the args directly matches the `Button`'s props, we can pass it into the args directly:

```jsx
export const Basic = (args) => <Button {...args} />;
```

This generates an interactive UI:

<center>
  <img src="https://raw.githubusercontent.com/storybookjs/storybook/next/addons/controls/docs/media/addon-controls-args-no-annotation.png" width="80%" />
</center>

Unfortunately this uses the default values specified in the component, and not the label `hello`, which is what we wanted. To address this, we add an `args` annotation to the story, which specifies the initial values:

```jsx
export const Basic = (args) => <Button {...args} />;
Basic.args = { label: 'hello' };
```

Now we're back where we started, but we have a fully interactive story!

<center>
  <img src="https://raw.githubusercontent.com/storybookjs/storybook/next/addons/controls/docs/media/addon-controls-args-annotated.png" width="80%" />
</center>

And this fully interactive story is also available in the `Docs` tab of Storybook:

<center>
  <img src="https://raw.githubusercontent.com/storybookjs/storybook/next/addons/controls/docs/media/addon-controls-args-docs.png" width="80%" />
</center>

### Custom controls args

There are cases where you'd like to customize the controls that get auto-generated from your component.

Consider the following modification to the `Button` we introduced above:

```tsx
import React from 'react';
interface ButtonProps {
  label?: string;
  background?: string;
}
export const Button = ({ background, label = 'FIXME' }: ButtonProps) => (
  <button style={{ backgroundColor: background }}>{label}</button>
);
```

And the slightly expanded story:

```jsx
export const Basic = (args) => <Button {...args} />;
Basic.args = { label: 'hello', background: '#ff0' };
```

This generates the following `Controls` UI:

<center>
  <img src="https://raw.githubusercontent.com/storybookjs/storybook/next/addons/controls/docs/media/addon-controls-args-background-string.png" width="80%" />
</center>

This works as long as you type a valid string into the auto-generated text control, but it's certainly is not the best UI for picking a color.

We can specify which controls get used by declaring a custom `ArgType` for the `background` property. `ArgTypes` encode basic metadata for args, such as `name`, `description`, `defaultValue` for an arg. These get automatically filled in by `Storybook Docs`.

`ArgTypes` can also contain arbitrary annotations which can be overridden by the user. Since `background` is a property of the component, let's put that annotation on the default export.

```jsx
import { Button } from './Button';
export default {
  title: 'Button',
  component: Button,
  argTypes: {
    background: { control: 'color' },
  },
};

export const Basic = (args) => <Button {...args} />;
Basic.args = { label: 'hello', background: '#ff0' };
```

This generates the following UI, which is what we wanted in the first place:

<center>
  <img src="https://raw.githubusercontent.com/storybookjs/storybook/next/addons/controls/docs/media/addon-controls-args-background-color.png" width="80%" />
</center>

> **NOTE:** `@storybook/addon-docs` provide shorthand for `type` and `control` fields, so in the previous example, `control: 'color'` is shorthand `control: { type: 'color' }`. Similarly, `type: 'number'` can be written as shorthand for `type: { name: 'number' }`.

### Fully custom args

Up until now, we've only been using auto-generated controls based on the component we're writing stories for. What happens when we want a control for something that's not part of the story?

Consider the following story for our `Button` from above:

```jsx
import range from 'lodash/range';
// export default etc.

export const Reflow = ({ count, label, ...args }) => (
  <>
    {range(count).map((i) => (
      <Button label={`${label} ${i}`} {...args} />
    ))}
  </>
);
Reflow.args = { count: 3, label: 'reflow' };
```

This generates the following UI:

<center>
  <img src="https://raw.githubusercontent.com/storybookjs/storybook/next/addons/controls/docs/media/addon-controls-args-reflow.png" width="80%" />
</center>

Storybook has inferred the control to be a numeric input based on the initial value of the `count` arg. As we did above, we can also specify a custom control [as we did above](#custom-controls). Only this time since it's story specific we can do it at the story level:

```jsx
// export const Reflow = ... (as above)
// Reflow.args = ...
Reflow.argTypes = {
  count: { control: { type: 'range', min: 0, max: 20 } },
};
```

This generates the following UI with a custom range slider:

<center>
  <img src="https://raw.githubusercontent.com/storybookjs/storybook/next/addons/controls/docs/media/addon-controls-args-reflow-slider.png" width="80%" />
</center>

**Note:** If you set a `component` for your stories, these `argTypes` will always be added automatically. If you ONLY want to use custom `argTypes`, don't set a `component`. You can still show metadata about your component by adding it to `subcomponents`.

#### Angular

To achieve this within an angular-cli build.

```jsx
export const Reflow = ({ count, label, ...args }) => ({
  props: {
    label: label,
    count: [...Array(count).keys()],
  },
  template: `<Button *ngFor="let i of count">{{label}} {{i}}</Button>`,
});
Reflow.args = { count: 3, label: 'reflow' };
```

### Template stories

Suppose you've created the `Basic` story from above, but now we want to create a second story with a different state, such as how the button renders with the label is really long.

The simplest thing would be to create a second story:

```jsx
export const VeryLongLabel = (args) => <Button {...args} />;
VeryLongLabel.args = { label: 'this is a very long string', background: '#ff0' };
```

This works, but it repeats code. What we want is to reuse the `Basic` story, but with a different initial state. In Storybook we do this idiomatically for Args stories by refactoring the first story into a reusable story function and then `.bind`ing it to create a duplicate object on which to hang `args`:

```jsx
const Template = (args) => <Button {...args} />;

export const Basic = Template.bind({});
Basic.args = { label: 'hello', background: '#ff0' };

export const VeryLongLabel = Template.bind({});
VeryLongLabel.args = { label: 'this is a very long string', background: '#ff0' };
```

We can even reuse initial args from other stories:

```jsx
export const VeryLongLabel = Template.bind({});
VeryLongLabel.args = { ...Basic.args, label: 'this is a very long string' };
```

<center>
  <img src="https://raw.githubusercontent.com/storybookjs/storybook/next/addons/controls/docs/media/addon-controls-args-template.png" width="80%" />
</center>

## Configuration

The controls addon can be configured in two ways:

- Individual controls can be configured via [control annotations](#control-annotations),
- The addon's appearance can be configured via [parameters](#parameters).

### Control annotations

As shown above in the [custom control args](#custom-controls-args) and [fully custom args](#fully-custom-args) sections, you can configure controls via a "control" annotation in the `argTypes` field of either a component or story.

Here is the full list of available controls:

| data type   | control type | description                                                    | options        |
| ----------- | ------------ | -------------------------------------------------------------- | -------------- |
| **array**   | array        | serialize array into a comma-separated string inside a textbox | separator      |
| **boolean** | boolean      | checkbox input                                                 | -              |
| **number**  | number       | a numeric text box input                                       | min, max, step |
|             | range        | a range slider input                                           | min, max, step |
| **object**  | object       | json editor text input                                         | -              |
| **enum**    | radio        | radio buttons input                                            | options        |
|             | inline-radio | inline radio buttons input                                     | options        |
|             | check        | multi-select checkbox input                                    | options        |
|             | inline-check | multi-select inline checkbox input                             | options        |
|             | select       | select dropdown input                                          | options        |
|             | multi-select | multi-select dropdown input                                    | options        |
| **string**  | text         | simple text input                                              | -              |
|             | color        | color picker input that assumes strings are color values       | presetColors   |
|             | date         | date picker input                                              | -              |

Example customizing a control for an `enum` data type (defaults to `select` control type):

```js
export default {
  title: 'Widget',
  component: Widget,
  argTypes: {
    loadingState: {
      control: { type: 'inline-radio', options: ['loading', 'error', 'ready'] },
    },
  },
};
```

Example customizing a `number` data type (defaults to `number` control type):

```js
export default {
  title: 'Gizmo',
  component: Gizmo,
  argTypes: {
    width: {
      control: { type: 'range', min: 400, max: 1200, step: 50 },
    },
  },
};
```

Example customizing a `color` data type:

```js
export default {
  title: 'Button',
  component: Button,
  argTypes: {
    backgroundColor: {
      control: { type: 'color', presetColors: ['#FFF', '#000', '#AAA'] },
    },
  },
};
```

### Parameters

Controls supports the following configuration parameters, either [globally or on a per-story basis](https://storybook.js.org/docs/basics/writing-stories/#parameters):

- [Expanded: show property documentation](#expanded-show-property-documentation)
- [Hide NoControls warning](#hide-nocontrols-warning)

#### Expanded: show property documentation

Since Controls is built on the same engine as Storybook Docs, it can also show property documentation alongside your controls using the `expanded` parameter (defaults to `false`).

To enable expanded mode globally, add the following to `.storybook/preview.js`:

```jsx
export const parameters = {
  controls: { expanded: true },
};
```

And here's what the resulting UI looks like:

<center>
  <img src="https://raw.githubusercontent.com/storybookjs/storybook/next/addons/controls/docs/media/addon-controls-expanded.png" width="80%" />
</center>

#### Hide NoControls warning

If you don't plan to handle the control args inside your Story, you can remove the warning with:

```jsx
Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};
```

## Framework support

|                | Manual | Auto-generated |
| -------------- | :----: | :------------: |
| React          |   +    |       +        |
| Vue            |   +    |       +        |
| Angular        |   +    |       +        |
| Ember          |   +    |       +        |
| Web components |   +    |       +        |
| HTML           |   +    |                |
| Svelte         |   +    |                |
| Preact         |   +    |                |
| Riot           |   +    |                |
| Mithril        |   +    |                |
| Marko          |   +    |                |

**Note:** `#` = WIP support

## FAQs

### How will this replace addon-knobs?

Addon-knobs is one of Storybook's most popular addons with over 1M weekly downloads, so we know lots of users will be affected by this change. Knobs is also a mature addon, with various options that are not available in addon-controls.

Therefore, rather than deprecating addon-knobs immediately, we will continue to release knobs with the Storybook core distribution until 7.0. This will give us time to improve Controls based on user feedback, and also give knobs users ample time to migrate.

If you are somehow tied to knobs or prefer the knobs interface, we are happy to take on maintainers for the knobs project. If this interests you, hop on our [Discord](https://discord.gg/UUt2PJb).

### How do I migrate from addon-knobs?

If you're already using [Storybook Knobs](https://github.com/storybookjs/storybook/tree/master/addons/knobs) you should consider migrating to Controls.

You're probably using it for something that can be satisfied by one of the cases [described above](#writing-stories).

Let's walk through two examples: migrating [knobs to auto-generated args](#knobs-to-custom-args) and [knobs to custom args](#knobs-to-custom-args).

<h4>Knobs to auto-generated args</h4>

First, let's consider a knobs version of a basic story that fills in the props for a component:

```jsx
import { text } from '@storybook/addon-knobs';
import { Button } from './Button';

export const Basic = () => <Button label={text('Label', 'hello')} />;
```

This fills in the Button's label based on a knob, which is exactly the [auto-generated](#auto-generated-args) use case above. So we can rewrite it using auto-generated args:

```jsx
export const Basic = (args) => <Button {...args} />;
Basic.args = { label: 'hello' };
```

<h4>Knobs to manually-configured args</h4>

Similarly, we can also consider a story that uses knob inputs to change its behavior:

```jsx
import range from 'lodash/range';
import { number, text } from '@storybook/addon-knobs';

export const Reflow = () => {
  const count = number('Count', 10, { min: 0, max: 100, range: true });
  const label = number('Label', 'reflow');
  return (
    <>
      {range(count).map((i) => (
        <Button label={`button ${i}`} />
      ))}
    </>
  );
};
```

And again, as above, this can be rewritten using [fully custom args](#fully-custom-args):

```jsx
export const Reflow = ({ count, label, ...args }) => (
  <>{range(count).map((i) => <Button label={`${label} ${i}` {...args}} />)}</>
);
Reflow.args = { count: 3, label: 'reflow' };
Reflow.argTypes = {
  count: { control: { type: 'range', min: 0, max: 20 } }
};
```

### My controls aren't being auto-generated. What should I do?

There are a few known cases where controls can't be auto-generated:

- You're using a framework for which automatic generation [isn't supported](#framework-support)
- You're trying to generate controls for a component defined in an external library

With a little manual work you can still use controls in such cases. Consider the following example:

```js
import { Button } from 'some-external-library';

export default {
  title: 'Button',
  argTypes: {
    label: { control: 'text' },
    borderWidth: { control: { type: 'number', min: 0, max: 10 }},
  },
};

export const Basic = (args) => <Button {...args} />;
Basic.args = {
  label: 'hello';
  borderWidth: 1;
};
```

The `argTypes` annotation (which can also be applied to individual stories if needed), gives Storybook the hints it needs to generate controls in these unsupported cases. See [control annotations](#control-annotations) for a full list of control types.

It's also possible that your Storybook is misconfigured. If you think this might be the case, please search through Storybook's [Github issues](https://github.com/storybookjs/storybook/issues), and file a new issue if you don't find one that matches your use case.

### How can I disable controls for certain fields on a particular story?

The `argTypes` annotation annotation can be used to hide controls for a particular row, or even hide rows.

Suppose you have a `Button` component with `borderWidth` and `label` properties (auto-generated or otherwise) and you want to hide the `borderWidth` row completely and disable controls for the `label` row on a specific story. Here's how you'd do that:

```js
import { Button } from 'button';

export default {
  title: 'Button',
  component: Button,
};

export const CustomControls = (args) => <Button {...args} />;
CustomControls.argTypes = {
  borderWidth: { table: { disable: true } },
  label: { control: { disable: true } },
};
```

Like [story parameters](https://github.com/storybookjs/storybook/blob/next/docs/src/pages/basics/writing-stories/index.md#parameters), `args` and `argTypes` annotations are hierarchically merged, so story-level annotations overwrite component-level annotations.

### How do controls work with MDX?

MDX compiles to component story format (CSF) under the hood, so there's a direct mapping for every example above using the `args` and `argTypes` props.

Consider this example in CSF:

```js
import { Button } from './Button';
export default {
  title: 'Button',
  component: Button,
  argTypes: {
    background: { control: 'color' },
  },
};

const Template = (args) => <Button {...args} />;
export const Basic = Template.bind({});
Basic.args = { label: 'hello', background: '#ff0' };
```

Here's the MDX equivalent:

```jsx
import { Meta, Story } from '@storybook/addon-docs/blocks';
import { Button } from './Button';

<Meta title="Button" component={Button} argTypes={{ background: { control: 'color' } }} />

export const Template = (args) => <Button {...args} />;

<Story name="Basic" args={{ label: 'hello', background: '#ff0' }}>
  {Template.bind({})}
</Story>
```

For more info, see a full [Controls example in MDX for Vue](https://raw.githubusercontent.com/storybookjs/storybook/next/examples/vue-kitchen-sink/src/stories/addon-controls.stories.mdx).
