<h1 align="center">
  <!-- Logo -->
  <img src="https://user-images.githubusercontent.com/4985201/120356895-ad781b00-c2b9-11eb-94dc-2eacc348819b.png" alt="Marko & Storybook Logo" height="118"/>
  <br/>
  <br/>
  Storybook for Marko
	<br/>

  <!-- Language -->
  <a href="http://typescriptlang.org">
    <img src="https://img.shields.io/badge/%3C%2F%3E-typescript-blue.svg" alt="TypeScript"/>
  </a>
  <!-- Format -->
  <a href="https://github.com/prettier/prettier">
    <img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="Styled with prettier"/>
  </a>
  <!-- CI -->
  <a href="https://github.com/storybookjs/marko/actions/workflows/ci.yml">
    <img src="https://github.com/storybookjs/marko/actions/workflows/ci.yml/badge.svg" alt="Build status"/>
  </a>
  <!-- Coverage -->
  <a href="https://codecov.io/gh/storybookjs/marko">
    <img src="https://codecov.io/gh/storybookjs/marko/branch/next/graph/badge.svg?token=SOKUXR8DLB"/>
  </a>
  <!-- NPM Version -->
  <a href="https://npmjs.org/package/@storybook/marko">
    <img src="https://img.shields.io/npm/v/@storybook/marko.svg" alt="NPM Version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@storybook/marko">
    <img src="https://img.shields.io/npm/dm/@storybook/marko.svg" alt="Downloads"/>
  </a>
</h1>

Storybook for Marko is a UI development environment for your Marko components.
With it, you can visualize different states of your UI components and develop them interactively.

<p align="center">
  <img src="https://github.com/storybookjs/storybook/blob/master/media/storybook-intro.gif" alt="Storybook Screenshot"/>
</p>

Storybook runs outside of your app.
So you can develop UI components in isolation without worrying about app specific dependencies and requirements.

## Getting Started

> `@storybook/marko@10` Is for storybook@10 and storybook@9, for storybook@8 use `@storybook/marko@9`.

> `@storybook/marko` >= 7 Only supports Marko 5+.
> For Marko 4 support use `@storybook/marko@6`.

```sh
cd my-marko-app
npx sb init --type marko --builder webpack5
```

For more information visit: [storybook.js.org](https://storybook.js.org)

## Example Stories

### Basic

Story functions in Marko are expected to return an object with two properties.

1. `component`: the template to render
2. `input`: the `input` to render the template with

```js
// button.stories.js
import Button from "./button.marko";

export const Primary = () => ({
  component: Button,
  input: {
    primary: true,
    label: "Button",
  },
});
```

### Common component for stories

Often a `.stories.js` file will export multiple stories using the same `.marko` template.
To simplify things you can set a `component` property on the [`default export` meta data](https://storybook.js.org/docs/react/writing-stories/introduction#default-export).
This will act as the default `component` to render for each story function.

```js
import Button from "./button.marko";

export default {
  title: "Button",
  component: Button,
};

export const Primary = () => ({
  input: {
    primary: true,
    label: "Button",
  },
});

export const Secondary = () => ({
  input: {
    primary: false,
    label: "Button",
  },
});
```

### Using Args

[Storybooks `args`](https://storybook.js.org/docs/react/writing-stories/args) provide a way to better document, simplify and configure the input passed to your templates.
Each story function will receive `args` as the first parameter, or you can simply export an object with the story meta (including `args`).

```js
import Button from "./button.marko";

export default {
  title: "Button",
  component: Button,
};

// When exporting a function, args are received.
export const Primary = (args) => ({ input: args });
Primary.args = {
  primary: true,
  label: "Button",
};

// Alternatively export an object with args which
// will always render the default exported component.
export const Secondary = {
  args: {
    primary: false,
    label: "Button",
  },
};
```

### Using Decorators

[Storybook `decorators`](https://storybook.js.org/docs/writing-stories/decorators) provide a way to wrap a component with another component to provide context, styling, or additional functionality.

With `@storybook/marko` your decorators _must_ be a function that returns the same signature as the story functions.
The `component` specified in the decorator will be provided a [`renderBody`](https://markojs.com/docs/syntax/#dynamic-body-content) which can be used to render the nested `Story` or another decorator.

```js
import Button from "./button.marko";
import Decorator from "./decorator.marko";

export default {
  title: "Button",
  component: Button,
  decorators: [
    () => ({
      component: Decorator,
      input: {
        // optionally pass some input to the decorator
      },
    }),
  ],
};

export const Primary = {
  args: {
    // ...
  },
};
```

### Using with TypeScript

Some types are exposed by this module to make it easier to write your stores using TypeScript.
Here is a simple story using the exposed types.

```ts
import type { Story, Meta } from "@storybook/marko";
import Button from "./button.marko";

interface ButtonInput {
  primary?: boolean;
  label: string;
}

export default {
  title: "Button",
  component: Button,
} as Meta<ButtonInput>;

export const Primary: Story<ButtonInput> = {
  args: {
    primarrrrry: true, // Will error with typescript!
  },
};
```

### Automatic docs from `Input` types

When [docs](https://storybook.js.org/docs/writing-docs) are enabled (eg with `@storybook/addon-docs`), Storybook reads each component's exported `Input` type and fills its controls and [autodocs](https://storybook.js.org/docs/writing-docs/autodocs) table from it, so most stories need no `argTypes` at all:

```marko
export interface Input {
  /**
   * The button's visual weight.
   * @default "secondary"
   */
  priority?: "primary" | "secondary" | "tertiary";
  /** Whether the menu is open. */
  open?: boolean;
  openChange?(open: boolean): void;
  /** The heading shown above the content. */
  header?: Marko.AttrTag<{
    /** The heading level. */
    level?: 2 | 3 | 4;
  }>;
}
```

- A doc comment on `Input` itself becomes the component's description, unless `parameters.docs.description.component` sets one.
- JSDoc descriptions, `@default` values, types and required-ness fill the table, and a union of literals becomes an option control in the order written.
- [Attribute tags](https://markojs.com/docs/reference/language#attribute-tags) (`Marko.AttrTag`) list their own members nested beneath them. Their controls start empty, since only a story's own `"@"` argTypes split its attribute tag args into them.
- Event handlers (`onFoo` or `on-foo` functions) log to the Actions panel and are grouped under "Events" in the table, with no `argTypesRegex` needed, so every story passes one. Set `action: false` in a handler's argType to leave it out. Handlers of attribute tags are listed but don't log, since an action for one would create the tag.
- A `fooChange` handler next to `foo` (the [controllable pattern](https://markojs.com/docs/explanation/controllable-components#the-controllable-pattern)) makes `foo` controllable, as if its argType said `controllable: true`, and shares its row. To opt out, set `controllable: false` and give `fooChange` its own argType if it should still be listed.
- Props inherited from your own types are listed like the rest. Those from types outside your project (eg `Input extends Marko.HTML.Button`) aren't listed (add an argType to list one), and a prop you re-declare from one shows only your docs.

Anything written in a story's `argTypes` wins over what is extracted, so reach for it only to change what the types can't say, such as a control's look. Types are read with `@storybook/marko`'s own TypeScript, so this works whichever version your project uses, if any. Components installed in `node_modules` aren't read. To turn extraction off, set `docgen: false` in the framework's options:

```ts
framework: {
  name: "@storybook/marko-vite",
  options: { docgen: false },
},
```

## Testing

`@storybook/marko` also ships with tools to make loading and rendering your stories in your tests easy! See our [testing documentation](./testing.md) for more details.

## Docs

- [Basics](https://storybook.js.org/docs/marko/get-started/introduction)
- [Configurations](https://storybook.js.org/docs/marko/configure/overview)
- [Addons](https://storybook.js.org/docs/marko/configure/storybook-addons)
