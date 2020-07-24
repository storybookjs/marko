---
title: 'Actions'
---

The actions addon is used to display data received by event handler (callback) args in your stories.

<div style="background-color:#F8FAFC">
TODO: add same image used in the SB 6.0 docs with the ui and the action logger with some action information
</div>


### Action Args

Actions works via supplying special Storybook-generated “action” args to your stories. There are two ways to get an action arg:

#### Action argType annotation

You can use [argTypes](../api/stories#argtypes) to tell Storybook that an arg to your story should be an action. Usually it makes sense to do this at the component level (although it can be done per story):

```js
// Button.stories.j

import Button from './button';

export default {
  title: 'Button',
  argTypes: { onClick: { action: 'clicked' } },
};
```

When Storybook sees this argType it will create an arg that is set to a special “action” callback. If your component calls this arg (based on user interaction) the event will show up in the action panel:

<div style="background-color:#F8FAFC">
TODO: add Gif mentioned in the SB 6.0 needs to be further vetted
</div>

#### Automatically matching args

Another option is to use a parameter to match all [argTypes](../api/stories#argtypes) that match a certain pattern. The following configuration automatically creates actions for each `on` argType (which you can either specify manually or can be [inferred automatically](locate-link-for-this)).

```js
// Button.stories.js

import Button from './button';

export default {
  title: 'Button',
  component: Button,
  parameters: { actions: { argTypesRegex: '^on.*' } },
};
```

> NOTE: If you're generating argTypes in using another addon (like [docs](locate-docs), which is the common behavior) you'll need to make sure that the actions addon loads **AFTER** the other addon. You can do this by listing it later in the addons registration code in [`.storybook/main.js`](../configure/overview#configure-story-rendering). This is default in [essentials](./introduction).


### Action event handlers

It is also possible to detect if your component is emitting the correct HTML events using the `parameters.actions.handles` [parameter](../writing-stories/parameters). 

```js
import Button from './button';

export default {
  title: 'Button',
  parameters: {
    actions: {
      handles: ['mouseover', 'click .btn']
  }
};
```

This will bind a standard HTML event handler to the outermost HTML element rendered by your component and trigger an action when the event is called for a given selector. The format is `<eventname> <selector>`. Selector is optional a defaults to all elements.

### Advanced / Legacy Usage

<div style="background-color:#F8FAFC">
TODO: ask about the advanced readme link
</div>

There are also some older ways to use actions as documented in the [advanced README](locate-advanced-readme).
