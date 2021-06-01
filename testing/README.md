<p align="center">
  <img src="https://user-images.githubusercontent.com/1671563/111436322-21b31180-8702-11eb-943f-93b5a0b02b50.png" alt="Storybook Marko Testing" width="100" />
</p>

<p align="center">Testing utilities that allow you to reuse your stories in your unit tests</p>

<br/>

## The problem

You are using [Storybook](https://storybook.js.org/) for your components and want to use your stories as fixtures in your tests.

With Storybook you are able to define the necessary boilerplate (theming, routing, state management, etc.) to make all of your components render correctly, and describe various scenarios that your components should render in. When you're writing tests you often end up needing to do the same thing. With the [Storybook component story format (CSF)](https://storybook.js.org/docs/marko/api/csf) you are able to write your stories in a way that allows them to easily be consumed by other tools, including your tests! However some things don't come for free, such as applying decorators, merging args / default values and so on.

## The solution

`@storybook/marko/testing` makes it easy to consume your Storybook stories as test fixtures while supporting many of the shorthands and features not taken care of automatically. Features such as [args](https://storybook.js.org/docs/marko/writing-stories/args), [decorators](https://storybook.js.org/docs/marko/writing-stories/decorators) / [global decorators](https://storybook.js.org/docs/marko/writing-stories/decorators#global-decorators), and [meta](https://storybook.js.org/docs/marko/api/csf#default-export) from your [story](https://storybook.js.org/docs/marko/api/csf#named-story-exports) will be composed by this library and returned to you in a component which you can render directly or using [`@marko/testing-library`](https://github.com/marko-js/testing-libraryhttps://github.com/marko-js/testing-library).

## Installation

This module ships with `@storybook/marko` and you can import it via `@storybook/marko/testing` as shown in the examples.

## Setup

### Storybook 6 and Component Story Format

This library requires you to be using Storybook version 6, [Component Story Format (CSF)](https://storybook.js.org/docs/marko/api/csf) and [hoisted CSF annotations](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#hoisted-csf-annotations), which is the recommended way to write stories since Storybook 6.

Essentially, if you use Storybook 6 and your stories look similar to this, you're good to go!

```js
import Button from "./button.marko";
// CSF: default export (meta) + named exports (stories)
export default {
  title: "Example/Button",
  component: Button,
};

const Primary = (args) => ({ input: args }); // or with Template.bind({})
Primary.args = {
  primary: true,
};
```

### Global config

> This is an optional step. If you don't have [global decorators](https://storybook.js.org/docs/marko/writing-stories/decorators#global-decorators), there's no need to do this. However, if you do, this is a necessary step for your global decorators to be applied.

If you have global decorators/parameters/etc and want them applied to your stories when testing them, you first need to set this up. You'll typically want to do this in a setup file for your favorite test framework.

```ts
import { setGlobalConfig } from "@storybook/testing-react";
import * as globalStorybookConfig from "./.storybook/preview"; // path of your preview.js file

setGlobalConfig(globalStorybookConfig);
```

## Usage

### `composeStories`

`composeStories` will process all stories from the component you specify, compose args/decorators in all of them and return an object containing the composed stories.

If you use the composed story (e.g. PrimaryButton), once the returned component is rendered it will automatically merge in `args` as `input` that are passed in the story. Any additional `input` provided when rendering the component will overwrite `args` in the story.

```ts
import { render } from "@testing-library/marko";
import { composeStories } from "@storybook/marko/testing";
import * as stories from "./Button.stories"; // import all stories from the stories file

// Every component that is returned maps 1:1 with the stories, but they
// already contain all decorators from story level, meta level and global level.
// When the component is rendered, args are also merged in.
const { Primary, Secondary } = composeStories(stories);

test("renders primary button with default args", () => {
  const { getByText } = render(Primary);
  const buttonElement = getByText(/Text coming from args in stories file!/i);
  expect(buttonElement).not.toBeNull();
});

test("renders primary button with overriden props", () => {
  const { getByText } = render(Primary, { label: "Hello world" }); // you can override props and they will get merged with values from the Story's args
  const buttonElement = getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
```

### `composeStory`

You can use `composeStory` if you wish to apply it for a single story rather than all of your stories. You need to pass the meta (default export) as well.

```ts
import { render } from "@marko/testing-library";
import { composeStory } from "@storybook/marko/testing";
import Meta, { Primary as PrimaryStory } from "./Button.stories";

// Returns a component that already contain all decorators from story level, meta level and global level.
// When the component is rendered, args are also merged in.
const Primary = composeStory(PrimaryStory, Meta);

test("onclick handler is called", async () => {
  const { emitted, getByRole } = render(Primary);
  const buttonElement = getByRole("button");
  buttonElement.click();
  expect(emitted("click")).toHaveLength(1);
});
```

## Typescript

For the types to be automatically picked up, your stories must be typed. See an example:

```ts
import type { Story, Meta } from "@storybook/marko/testing";

import { Button } from "./Button";

export default {
  title: "Components/Button",
  component: Button,
} as Meta;

interface ButtonInput {
  label: string;
}

// Story<Input> is the key piece needed for typescript validation
const Template: Story<ButtonInput> = (args) => ({ input: args });

export const Primary = Template.bind({});
Primary.args = {
  label: "Hello Marko!",
};
```
