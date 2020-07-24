---
title: 'Controls'
---

<div style="background-color:#F8FAFC">
TODO add same gif used in the SB 6.0 docs
</div>

Storybook Controls gives you a graphical UI to interact with a component's arguments dynamically, without needing to code. It creates an addon panel next to your component examples ("stories"), so you can edit them live.

It does not require any modification to your components, and stories for controls are:

- Convenient. Auto-generate controls based on React/Vue/Angular/etc. components.
- Portable. Reuse your interactive stories in documentation, tests, and even in designs.
- Rich. Customize the controls and interactive data to suit your exact needs.

To use the controls addon, you need to write your stories using [args](../writing-stories/args). Storybook will automatically generate controls based on your args and what it can infer about your component; but you can configure the controls further using [argTypes](../api/stories#argtypes), see below.

<div style="background-color:#F8FAFC">
ask tom/dom/michael for the link of the migration guide.
</div>

> If you have written stories in the older pre-Storybook 6 style, you may want to read the [args&controls migration guide] to help understand how to convert your stories for args.

### Choosing the control type

By default, Storybook will choose a control for each arg based on the initial value of the arg. This works well with some kind of args, such as boolean values or free-text strings, but in other cases you want a more restricted control.

For instance, suppose you have a `backgroundColor` arg on your story:

```js
// Button.stories.js

const Red = ButtonStory.bind({});
Red.args = {
   backgroundColor: '#e00',
};
```

By default, Storybook will render a free text input for the `backgroundColor` arg:

<div style="background-color:#F8FAFC">
TODO add same image used in the SB 6.0 docs with highlighted background control
</div>

This works as long as you type a valid string into the auto-generated text control, but it's not the best UI for picking a color. Let’s replace it with Storybook’s color picker component.

We can specify which controls get used by declaring a custom [argType](../api/stories#argtypes) for the `backgroundColor` property. ArgTypes encode basic metadata for args, such as name, description, defaultValue for an arg. These get automatically filled in by Storybook Docs.

ArgTypes can also contain arbitrary annotations which can be overridden by the user. Since `backgroundColor` is a property of the component, let's put that annotation on the default export.

```js
import { Button } from './Button';
export default {
  title: 'Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};
```

This replaces the input with a color picker leading to a more intuitive developer experience.

<div style="background-color:#F8FAFC">
TODO add same image used in the SB 6.0 docs color picker opened
</div>

### Fully custom args

<div style="background-color:#F8FAFC">
ask tom for location of complex stories link
</div>

Up until now, we've only used auto-generated controls based on the component we're writing stories for. If we are writing [complex stories](locate-complex-stories) we may want to add controls for args that aren’t part of the component.

```js
// Table.stories.js

const TableStory = ({ data, ...args }) => (
  <Table {...args} >
    {data.map(row => (<TR>{row.map(item => <TD>{item}</TD>}</TR>))}
  </Table>
)

export const Numeric = TableStory.bind({});
Numeric.args = {
  // This arg is for the story component
  data: [[1, 2, 3], [4, 5, 6]],
  // The remaining args get passed to the `Table` component
  size: 'large',
}
```

By default, Storybook will add controls for all args that:

<div style="background-color:#F8FAFC">
TODO: check if the link to the framework support is correct.
</div>

- It infers from the component definition [if your framework supports it](https://github.com/storybookjs/storybook/tree/next/addons/controls#framework-support)
- Appear in the list of args for your story.

You can determine the control by using `argTypes` in each case.

### Configuration

The controls addon can be configured in two ways:

- Individual controls can be configured via control annotations.
- The addon's appearance can be configured via parameters.

#### Annotations

As shown above, you can configure individual controls with the “control" annotation in the [argTypes](../api/stories#argtypes) field of either a component or story.

Here is the full list of available controls you can use:

|Data Type	    |Control Type	  |Description	                                                  |Options       |
|:--------------|:-------------:|:-------------------------------------------------------------:|:------------:|
|**array**	    |array          |serialize array into a comma-separated string inside a textbox	|separator     |
|**boolean**	  |boolean	      |checkbox input	                                                |-             |
|**number**     |number	        |a numeric text box input	                                      |min, max, step|
|               |range	        |a range slider input	                                          |min, max, step|
|**object**	    |object	        |json editor text input	                                        |-             |
|**enum**	      |radio	        |radio buttons input	                                          |options       |
|               |inline-radio	  |inline radio buttons input	                                    |options       |
|               |check	        |multi-select checkbox input	                                  |options       |
|               |inline-check	  |multi-select inline checkbox input	                            |options       |
|               |select	        |select dropdown input	                                        |options       |
|               |multi-select	  |multi-select dropdown input	                                  |options       |
|**string**	    |text	          |simple text input	                                            |-             |
|               |color	        |color picker input that assumes strings are color values	      |-             |
|               |date	          |date picker input	                                            |-             |

If you need to customize a control to use a enum data type in your story, for instance the `inline-radio` you can do it like so:

<!-- Example customizing a control for an enum data type (defaults to select control type): -->

```js
export default {
  title: 'Widget',
  component: Widget,
  argTypes: {
    loadingState: {
      type: 'inline-radio',
      options: ['loading', 'error', 'ready'],
    },
  },
};
```
<div class="aside">
If you don't provide a specific one, it defaults to select control type.
</div>

If you need to customize a control for a number data type in your story, you can do it like so:

<!-- Example customizing a number data type (defaults to number control type): -->

```js
export default {
  title: 'Gizmo',
  component: Gizmo,
  argTypes: {
    width: { type: 'range', min: 400, max: 1200, step: 50 };
  },
};
```

<div class="aside">
If you don't provide a specific one, it defaults to  number control type.
</div>


#### Parameters

Controls supports the following configuration [parameters](../writing-stories/parameters), either globally or on a per-story basis:

<div style="background-color:#F8FAFC">
Ask tom about this item=> Expanded: show property documentation
</div>

Since Controls is built on the same engine as Storybook Docs, it can also show property documentation alongside your controls using the expanded parameter (defaults to false). This means you embed a complete [Props table](locate-props-table) doc block in the controls pane. The description and default value rendering can be [customized](locate-customized) in the same way as the doc block.

To enable expanded mode globally, add the following to [`.storybook/preview.js`](../configure/overview#configure-story-rendering):

```js
// .storybook/preview.js

export const parameters = {
  controls: { expanded: true },
};
```
And here's what the resulting UI looks like:

<div style="">
TODO: add same image used in the SB 6.0 docs with highlighted control
</div>

#### Hide NoControls warning

If you don't plan to handle the control args inside your Story, you can remove the warning with:

```js
Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};
```
