<center>
  <img src="./media/props-tables-hero.png" width="100%" />
</center>

<h1>Storybook Docs Props Tables</h1>

Storybook Docs automatically generates props tables for components in supported frameworks. This document is a consolidated summary of prop tables, provides instructions for reporting bugs, and list known limitations for each framework.

- [Usage](#usage)
- [Controls](#controls)
  - [DocsPage](#docspage)
  - [MDX](#mdx)
  - [Controls customization](#controls-customization)
  - [Rows customization](#rows-customization)
- [Reporting a bug](#reporting-a-bug)
- [Known limitations](#known-limitations)
- [More resources](#more-resources)

## Usage

For framework-specific setup instructions, see the framework's README: [React](../react/README.md), [Vue](../vue/README.md), [Angular](../angular/README.md), [Web Components](../web-components/README.md), [Ember](../ember/README.md).

To use the props table in [DocsPage](./docspage.md), simply export a component property on your stories metadata:

```js
// MyComponent.stories.js
import { MyComponent } from './MyComponent';

export default {
  title: 'MyComponent',
  component: MyComponent,
};
// stories etc...
```

To use the props table in [MDX](./mdx.md), use the `Props` block:

```js
// MyComponent.stories.mdx
import { Props } from '@storybook/addon-docs/blocks';
import { MyComponent } from './MyComponent';

# My Component!

<Props of={MyComponent} />
```

## Controls

Starting in SB 6.0, the `Props` block has built-in `Controls` (formerly known as "knobs") for editing stories dynamically.

<center>
  <img src="./media/args-controls.gif" width="100%" />
</center>

These controls are implemented appear automatically in the props table when your story accepts [Storybook Args](https://github.com/storybookjs/storybook/blob/next/docs/src/pages/formats/component-story-format/index.md#args-story-inputs) as its input.

### DocsPage

In DocsPage, simply write your story to consume args and the auto-generated props table will display controls in the right-most column:

```js
export default {
  title: 'MyComponent',
  component: MyComponent,
};

export const Controls = (args) => <MyComponent {...args} />;
```

These controls can be [customized](#controls-customization) if the defaults don't meet your needs.

### MDX

In [MDX](./mdx.md), the `Props` controls are more configurable than in DocsPage. In order to show controls, `Props` must be a function of a story, not a component:

```js
<Story name="Controls">
  {args => <MyComponent {...args} />}
</Story>

<Props story="Controls" />
```

### Controls customization

Under the hood, props tables are rendered from an internal data structure called `ArgTypes`. When you declare a story's `component` metadata, Docs automatically extracts `ArgTypes` based on the component's properties. We can customize this by editing the `argTypes` metadata.

For example, consider a `Label` component that accepts a `background` color:

```js
import React from 'react';
import PropTypes from 'prop-types';

export const Label = ({ label, borderWidth, background }) => <div style={{ borderWidth, background }}>{label}</div>;
Label.propTypes = {
  label: PropTypes.string;
  borderWidth: PropTypes.number;
  background: PropTypes.string;
}
```

Given this input, the Docs addon will show a text editor for the `background` and a numeric input for the `borderWidth` prop:

<center>
  <img src="./media/props-tables-controls-uncustomized.png" width="100%" />
</center>

But suppose we prefer to show a color picker for `background` and a numeric input for `borderWidth`. We can customize this in the story metadata's `argTypes` field (at the component OR story level):

```js
export default {
  title: 'Label',
  component: Label,
  argTypes: {
    background: { control: { type: 'color' } },
    borderWidth: { control: { type: 'range', min: 0, max: 6 } },
  },
};
```

This generates the following custom UI:

<center>
  <img src="./media/props-tables-controls-customized.png" width="100%" />
</center>

Support controls include `array`, `boolean`, `color`, `date`, `range`, `object`, `text`, as well as a number of different options controls: `radio`, `inline-radio`, `check`, `inline-check`, `select`, `multi-select`.

To see the full list of configuration options, see the [typescript type defintions](https://github.com/storybookjs/storybook/blob/next/lib/components/src/controls/types.ts).

### Rows customization

In addition to customizing [controls](#controls-customization), it's also possible to customize `Props` fields, such as description, or even the rows themselves.

Consider the following story for the `Label` component from in the previous section:

```js
export const Batch = ({ labels, padding }) => (
  <div style={{ padding }}>
    {labels.map((label) => (
      <Label key={label} label={label} />
    ))}
  </div>
);
```

In this case, the args are basically unrelated to the underlying component's props, and are instead related to the individual story. To generate a prop table for the story, you can configure the Story's metadata:

```js
Batch.story = {
  argTypes: {
    labels: {
      description: 'A comma-separated list of labels to display',
      defaultValue: 'a,b,c',
      control: { type: 'array' }
    }
    padding: {
      description: 'The padding to space out labels int he story',
      defaultValue: 4,
      control: { type: 'range', min: 0, max: 20, step: 2 },
    }
  }
}
```

In this case, the user-specified `argTypes` are not a subset of the component's props, so Storybook shows ONLY the user-specified `argTypes`, and shows the component's props (without controls) in a separate tab.

## Reporting a bug

Extracting component properties from source is a tricky problem with thousands of corner cases. We've designed this package and its tests to accurately isolate problems, since the cause could either be in this package or (likely) one of the packages it depends on.

If you're seeing a problem with your prop table, here's what to do.

First, look to see if there's already a test case that corresponds to your situation. If there is, it should be documented in the [Known Limitations](#known-limitations) section above. There should also be one or more corresponding test fixtures contained in this package. For example, if you are using React, look under the directory `./src/frameworks/react/__testfixtures__`.

If your problem is not already represented here, do the following:

1. Create a **MINIMAL** repro for your problem. Each case should be just a few lines of code.
2. Place it in the appropriate directory `./src/frameworks/<framework>/__testfixtures__/`, e.g. `./src/frameworks/react/__testfixtures__/XXXX-some-description`, where `XXXX` is the corresponding github issue.
3. Run the tests for your `<framework>`, e.g. `yarn jest --testPathPattern=react-properties.test.ts --watch`
4. Inspect the output files for your test case.
5. Add the example to the appropriate stories file, e.g. `react-properties.stories.ts` for `react`, for a visual repro

If the problem appears to be an issue with this library, file an issue and include a PR that includes your repro.

If the problem appears to be an issue with the sub-package, please file an issue on the appropriate sub-package, document the limitation in [Known Limitations](#known-limitations) below, link to that issue, and submit a PR including the updated documentation and fixtures/snapshots.

## Known limitations

This package relies on a variety of sub-packages to extract property information from components. Many of the bugs in this package correspond to bugs in a sub-package. Since we don't maintain the sub-packages, the best we can do for now is (1) document these limitations, (2) provide clean reproductions to the sub-package, (3) optionally provide PRs to those packages to fix the problems.

| Framework      | Underlying library                       | Docs                                             | Open issues                                                                                                                                                        |
| -------------- | ---------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| React          | `react-docgen` `react-docgen-typescript` | [Docs](../react/README.md#props-tables)          | [Open issues](https://github.com/storybookjs/storybook/issues?q=is%3Aopen+is%3Aissue+label%3A%22block%3A+props%22+label%3Abug+label%3A%22app%3A+react%22)          |
| Vue            | `vue-docgen-api`                         | [Docs](../vue/README.md#props-tables)            | [Open issues](https://github.com/storybookjs/storybook/issues?q=is%3Aopen+is%3Aissue+label%3A%22block%3A+props%22+label%3Abug+label%3A%22app%3A+vue%22)            |
| Angular        | `compodoc`                               | [Docs](../angular/README.md#props-tables)        | [Open issues](https://github.com/storybookjs/storybook/issues?q=is%3Aopen+is%3Aissue+label%3A%22block%3A+props%22+label%3Abug+label%3A%22app%3A+angular%22)        |
| Web-components | `custom-elements.json`                   | [Docs](../web-components/README.md#props-tables) | [Open issues](https://github.com/storybookjs/storybook/issues?q=is%3Aopen+is%3Aissue+label%3A%22block%3A+props%22+label%3Abug+label%3A%22app%3A+web-components%22) |
| Ember          | `yui-doc`                                | [Docs](../ember/README.md#props-tables)          | [Open issues](https://github.com/storybookjs/storybook/issues?q=is%3Aopen+is%3Aissue+label%3A%22block%3A+props%22+label%3Abug+label%3A%22app%3A+ember%22)          |

## More resources

- References: [README](../README.md) / [DocsPage](docspage.md) / [MDX](mdx.md) / [FAQ](faq.md) / [Recipes](recipes.md) / [Theming](theming.md) / [Props](props-tables.md)
- Framework-specific docs: [React](../react/README.md) / [Vue](../vue/README.md) / [Angular](../angular/README.md) / [Web components](../web-components/README.md) / [Ember](../ember/README.md)
- Announcements: [Vision](https://medium.com/storybookjs/storybook-docs-sneak-peak-5be78445094a) / [DocsPage](https://medium.com/storybookjs/storybook-docspage-e185bc3622bf) / [MDX](https://medium.com/storybookjs/rich-docs-with-storybook-mdx-61bc145ae7bc) / [Framework support](https://medium.com/storybookjs/storybook-docs-for-new-frameworks-b1f6090ee0ea)
- Example: [Storybook Design System](https://github.com/storybookjs/design-system)
