<center>
  <img src="./media/props-tables-hero.png" width="100%" />
</center>

<h1>Storybook Docs Props Tables</h1>

Storybook Docs automatically generates props tables for components in supported frameworks. This document is a consolidated summary of prop tables, provides instructions for reporting bugs, and list known limitations for each framework.

- [Usage](#usage)
- [Reporting a bug](#reporting-a-bug)
- [Known limitations](#known-limitations)
  - [React](#react)
    - [Fully support React.FC](#fully-support-reactfc)
  - [Vue](#vue)
  - [Angular](#angular)
  - [Web components](#web-components)
  - [Ember](#ember)
- [More resources](#more-resources)

## Usage

For framework-specific setup instructions, see the framework's README: [React](../../react/README.md), [Vue](../../vue/README.md), [Angular](../../angular/README.md), [Web Components](../../web-components/README.md), [Ember](../../ember/README.md).

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

### React

SB Docs for React uses `babel-plugin-react-docgen`/`react-docgen` for both JS PropTypes prop tables and, as of 6.0, TypeScript-driven props tables.

#### Fully support React.FC

The biggest known issue is https://github.com/reactjs/react-docgen/issues/387, which means that the following common pattern **DOESN'T WORK**:

```tsx
import React, { FC } from 'react';
interface IProps { ... };
const MyComponent: FC<IProps> = ({ ... }) => ...
```

The following workaround is needed:

```tsx
const MyComponent: FC<IProps> = ({ ... }: IProps) => ...
```

Please upvote https://github.com/reactjs/react-docgen/issues/387 if this is affecting your productivity, or better yet, submit a fix!

### Vue

SB Docs for Vue uses `vue-docgen-loader`/`vue-docgen-api` for SFC and JSX components.

### Angular

SB Docs for Angular uses `compodoc` for prop table information.

### Web components

SB Docs for Web-components uses `custom-elements.json` for prop table information.

### Ember

SB Docs for Ember uses `yui-doc` for prop table information.

## More resources

- References: [README](../README.md) / [DocsPage](docspage.md) / [MDX](mdx.md) / [FAQ](faq.md) / [Recipes](recipes.md) / [Theming](theming.md)
- Framework-specific docs: [React](../react/README.md) / [Vue](../vue/README.md) / [Angular](../angular/README.md) / [Web components](../web-components/README.md) / [Ember](../ember/README.md)
- Announcements: [Vision](https://medium.com/storybookjs/storybook-docs-sneak-peak-5be78445094a) / [DocsPage](https://medium.com/storybookjs/storybook-docspage-e185bc3622bf) / [MDX](https://medium.com/storybookjs/rich-docs-with-storybook-mdx-61bc145ae7bc) / [Framework support](https://medium.com/storybookjs/storybook-docs-for-new-frameworks-b1f6090ee0ea)
- Example: [Storybook Design System](https://github.com/storybookjs/design-system)
