## storiesOf (Legacy) API

`storiesOf` is Storybook's Legacy API for adding stories. Up until Storybook 5.2, it has been the primary way to create stories in Storybook.

In Storybook 5.2 we introduced a simpler and more portable [Component Story Format](https://storybook.js.org/docs/react/api/csf), and all future tools and infrastructure will be oriented towards CSF. Therefore, we recommend migrating your stories out of `storiesOf` API, and even provide [automated tools to do this](#component-story-format-migration).

That said, the `storiesOf` API is not officially deprecated. For the time being we plan to support it for the foreseeable future.

## storiesOf API

A Storybook is a collection of stories. Each story represents a single visual state of a component.

Here's a basic story file in the `storiesOf` API:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from '../components/Button';

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));
```

The string argument to `storiesOf` is the component title. If you pass a string like `'Widgets|Button/Button'` it can also be used to position your component's story within Storybook's story hierarchy.

The second argument of `storiesOf` is a webpack `module`, which is available on the global (per-file) scope. Storybook needs it to enable hot-module-replacement. If it's not included you'll need to refresh your browser with each change you make.

Each `.add` call takes a story name, a story function that returns a renderable object (JSX in the case of React), and optionally some parameters, which are described below.

## Decorators and parameters

[Decorators](https://storybook.js.org/docs/react/writing-stories/decorators) and [parameters](https://storybook.js.org/docs/react/writing-stories/parameters) can be specified globally, at the component level, or locally at the story level.

In the `storiesOf` API, story-level parameters are provided as a third argument to `.add`:

```js
storiesOf('Button', module).add(
  'with text',
  () => <Button onClick={action('clicked')}>Hello Button</Button>,
  { notes: someNotes }
);
```

Story-level decorators are provided via parameters:

```js
storiesOf('Button', module).add(
  'with text',
  () => <Button onClick={action('clicked')}>Hello Button</Button>,
  { decorators: [withKnobs] }
);
```

We can control how the component's stories will render with parameters and decorators. You can use as many `.addDecorators` as you need (but make sure you add them all before your first story), but you can only use one `.addParameters`, as you can see in the example below:

```js
storiesOf('Button', module)
  .addParameters({backgrounds: {values: [{name: "red" value: "#f00"}]}})
  .addDecorator((Story) => <div style={{ margin: '3em' }}><Story/></div>)
  .addDecorator((Story) => <div style={{ height: '600px' }}><Story/></div>)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));
```

Parameters and decorators can also be used globally, you can define them in your .storybook/preview.js. Take a look [here](https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters) to learn more about global parameters and [here](https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators) for global decorators.

## Component Story Format migration

To make it easier to adopt the new [Component Story Format (CSF)](https://storybook.js.org/docs/react/api/csf), we've created an automatic migration tool to transform `storiesOf` API to Module format.

```sh
sb migrate storiesof-to-csf --glob=src/**/*.stories.js
```

For more information, see the CLI's [Codemod README](https://github.com/storybookjs/storybook/tree/next/lib/codemod).
