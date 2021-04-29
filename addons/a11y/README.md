# storybook-addon-a11y

This storybook addon can be helpful to make your UI components more accessible.

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

![Screenshot](https://raw.githubusercontent.com/storybookjs/storybook/HEAD/addons/a11y/docs/screenshot.png)

## Getting started

First, install the addon.

```sh
$ yarn add @storybook/addon-a11y --dev
```

Add this line to your `main.js` file (create this file inside your storybook config directory if needed).

```js
module.exports = {
  addons: ['@storybook/addon-a11y'],
};
```

```js
import React from 'react';

export default {
  title: 'button',
};

export const accessible = () => <button>Accessible button</button>;

export const inaccessible = () => (
  <button style={{ backgroundColor: 'red', color: 'darkRed' }}>Inaccessible button</button>
);
```

## Handling failing rules

When a Story has failing rules (accessibility violations), there are mutliple ways to handle these failures.

### Global overrides

When an exception should apply to all stories, set `parameters.a11y.config.rules` in your Storybook’s `preview.ts` file.

For example, to add support for autocomplete in Chrome across all your stories:

```js
// .storybook/preview.ts
export const parameters = {
  a11y: {
    config: {
      rules: [
        {
          // Add support for `autocomplete="nope"`, a workaround to prevent autocomplete in Chrome
          // @link https://bugs.chromium.org/p/chromium/issues/detail?id=468153
          id: 'autocomplete-valid',
          selector: '*:not([autocomplete="nope"])',
        },
      ],
    },
  },
};
```

At the Story level, instead of disabling a11y checks, override rules using `parameters.a11y.options.rules`.

```js
MyStory.parameters = {
  a11y: {
    // Avoid doing this! It will fully disable all accessibility checks for this story.
    disable: true,

    // Instead, override rules 👇
    // axe-core optionsParameter (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter)
    options: {
      // Learn more about the rules API: https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#parameters-1
      rules: [
        {
          // You can exclude some elements from being checked by a specific rule
          id: 'autocomplete-valid',
          selector: '*:not([autocomplete="nope"])',
        },
        {
          // When there’s a false positive, it's okay to disable a specific rule.
          // For example, if an entire component is disabled, color contrast ratio doesn't need to meet 4.5:1.
          // @link https://dequeuniversity.com/rules/axe/4.1/color-contrast?application=axeAPI
          id: 'color-contrast',
          enabled: false,
        },
        {
          // Sometimes, you just need tests to pass so you can ship…
          // Don’t set { a11y: { disable: true } }, as it will fully disable all accessibility checks for this story.
          // Instead, signify that a violation will need to be fixed in the future:
          id: 'landmark-complementary-is-top-level',
          reviewOnFail: true, // Override the result of a rule to return "Needs Review" rather than "Violation" if the rule fails.
        },
      ],
    },
  },
};
```

Tip: when you override a rule, expain why in a comment. That context will be helpful to you and your team when debugging particularly gnarly accessibility issues.

### Disabling checks

If you wish to selectively disable `a11y` checks for a subset of stories, you can control this with story parameters:

```js
export const MyNonCheckedStory = () => <SomeComponent />;
MyNonCheckedStory.parameters = {
  // Avoid doing this, as it fully disables all accessibility checks for this story.
  a11y: { disable: true },
};
```

## Parameters

For more customizability use parameters to configure [aXe options](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure).
You can override these options [at story level too](https://storybook.js.org/docs/react/configure/features-and-behavior#per-story-options).

```js
import React from 'react';
import { storiesOf, addDecorator, addParameters } from '@storybook/react';

export default {
  title: 'button',
  parameters: {
    a11y: {
      // optional selector which element to inspect
      element: '#root',
      // axe-core configurationOptions (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#parameters-1)
      config: {},
      // axe-core optionsParameter (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter)
      options: {},
      // optional flag to prevent the automatic check
      manual: true,
    },
  },
};

export const accessible = () => <button>Accessible button</button>;

export const inaccessible = () => (
  <button style={{ backgroundColor: 'red', color: 'darkRed' }}>Inaccessible button</button>
);
```

## Roadmap

- Make UI accessible
- Show in story where violations are.
- Add more example tests
- Add tests
- Make CI integration possible
