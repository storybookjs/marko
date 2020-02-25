# Storybook Addon Actions

Storybook Addon Actions can be used to display data received by event handlers in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

![Screenshot](https://raw.githubusercontent.com/storybookjs/storybook/HEAD/addons/actions/docs/screenshot.png)

## Getting Started

Install:

```sh
npm i -D @storybook/addon-actions
```

Then, add following content to `.storybook/main.js`

```js
module.exports = {
  addons: ['@storybook/addon-actions'],
};
```

## Actions args

Starting in SB6.0, we recommend using story parameters to specify actions which get passed into your story as [Args](https://docs.google.com/document/d/1Mhp1UFRCKCsN8pjlfPdz8ZdisgjNXeMXpXvGoALjxYM/edit?usp=sharing) (passed as the first argument when `passArgsFirst` is set to `true`).

The first option is to specify `argTypes` for your story with an `action` field. Take the following example:

```js
import Button from './button';

export default {
  title: 'Button',
  argTypes: { onClick: { action: 'clicked' } },
};

export const Basic = ({ onClick }) => <Button onClick={onClick}>Hello World!</Button>;
```

Alternatively, suppose you have a naming convention, like `onX` for event handlers. The following configuration automatically creates actions for each `onX` `argType` (which you can either specify manually or generate automatically using [Storybook Docs](https://www.npmjs.com/package/@storybook/addon-docs).

```js
import Button from './button';

export default {
  title: 'Button',
  component: Button,
  parameters: { actions: { argTypesRegex: '^on.*' } },
};

export const Basic = ({ onClick }) => <Button onClick={onClick}>Hello World!</Button>;
```

> **NOTE:** If you're generating `argTypes` in using another addon (like Docs, which is the common behavior) you'll need to make sure that the actions addon loads **AFTER** the other addon. You can do this by listing it later in the `addons` registration code in `.storybook/main.js`.

## Manually-specified actions

Import the `action` function and use it to create actions handlers. When creating action handlers, provide a **name** to make it easier to identify.

> _Note: Make sure NOT to use reserved words as function names. [issues#29](https://github.com/storybookjs/storybook-addon-actions/issues/29#issuecomment-288274794)_

```js
import { action } from '@storybook/addon-actions';
import Button from './button';

export default {
  title: 'Button',
  component: Button,
};

export const defaultView = () => <Button onClick={action('button-click')}>Hello World!</Button>;
```

## Multiple actions

If your story requires multiple actions, it may be convenient to use `actions` to create many at once:

```js
import { actions } from '@storybook/addon-actions';
import Button from './button';

export default {
  title: 'Button',
  component: Button,
};

// This will lead to { onClick: action('onClick'), ... }
const eventsFromNames = actions('onClick', 'onMouseOver');

// This will lead to { onClick: action('clicked'), ... }
const eventsFromObject = actions({ onClick: 'clicked', onMouseOver: 'hovered' });

export const first = () => <Button {...eventsFromNames}>Hello World!</Button>;

export const second = () => <Button {...eventsFromObject}>Hello World!</Button>;
```

## Configuration

Arguments which are passed to the action call will have to be serialized while be "transferred" over the channel.

This is not very optimal and can cause lag when large objects are being logged, for this reason it is possible to configure a maximum depth.

The action logger, by default, will log all actions fired during the lifetime of the story. After a while this can make the storybook laggy. As a workaround, you can configure an upper limit to how many actions should be logged.

To apply the configuration globally use the `configureActions` function in your `preview.js` file.

```js
import { configureActions } from '@storybook/addon-actions';

configureActions({
  depth: 100,
  // Limit the number of items logged into the actions panel
  limit: 20,
});
```

To apply the configuration per action use:

```js
action('my-action', {
  depth: 5,
});
```

### Available Options

| Name                 | Type    | Description                                                                         | Default |
| -------------------- | ------- | ----------------------------------------------------------------------------------- | ------- |
| `depth`              | Number  | Configures the transferred depth of any logged objects.                             | `10`    |
| `clearOnStoryChange` | Boolean | Flag whether to clear the action logger when switching away from the current story. | `true`  |
| `limit`              | Number  | Limits the number of items logged in the action logger                              | `50`    |

## Declarative Configuration via Parameters

You can define action handles in a declarative way using parameters. They accepts the same arguments as [`actions`](#multiple-actions)
Keys have `'<eventName> <selector>'` format, e.g. `'click .btn'`. Selector is optional. This can be used with any framework but is especially useful for `@storybook/html`.

```js
import Button from './button';

export default {
  title: 'Button',
  parameters: {
    actions: {
      handles: ['mouseover', 'click .btn']
  }
};

export const first = () => <Button className="btn">Hello World!</Button>;
```
