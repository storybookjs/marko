---
title: 'Parameters'
---

**Parameters** are a set of static, named metadata about a story, typically used to control the behaviour of Storybook features and addons.

For example, let’s customize the backgrounds addon via a parameter. We’ll use `parameters.backgrounds` to define which backgrounds appear in the backgrounds toolbar when a story is selected.

### Story parameters

We can set a parameter for a single story with the `parameters` key on a CSF export:

```js
export const Primary = Story.bind({});
Primary.args = …
Primary.parameters = { backgrounds: … };
```

### Component parameters

We can set the parameters for all stories of a component using the `parameters` key on the default CSF export:

```js
import Button from ‘./Button’;
export default {
  title: “Button”,
  component: Button,
  parameters: {
    backgrounds: {...}
  }
};
```

### Global parameters

<div>
TODO: ask tom/dom for a bit more clarification about the preview.js file
</div>

We can also set the parameters for **all stories** via the `parameters` export of your [`.storybook/preview.js`](locate-preview) file (this is the file where you configure all stories):

```js
export const parameters = {
  backgrounds: {...},
}
```

Setting a global parameter is a common way to configure addons. With backgrounds, you configure the list of backgrounds that every story can render in. 

### Rules of parameter inheritance

The way the global, component and story parameters are combined is:

- More specific parameters take precedence (so a story parameter overwrites a component parameter which overwrites a global parameter).
- Parameters are **merged** so keys are only ever overwritten, never dropped.

The merging of parameters is important. It means it is possible to override a single specific sub-parameter on a per-story basis but still retain the majority of the parameters defined globally.

If you are defining an API that relies on parameters (e..g an __addon__) it is a good idea to take this behaviour into account.
