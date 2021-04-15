---
title: 'Args'
---

A story is a component with a set of arguments that define how the component is to be rendered. “Args” are Storybook’s mechanism for defining those arguments in a single JavaScript object. Args can be used to dynamically change props, slots, styles, inputs, etc. This allows Storybook and its addons to live edit components. You _do not_ need to change your underlying component code to use args.

When an arg’s value is changed, the component re-renders, allowing you to interact with components in Storybook’s UI via addons that affect args.

Learn how and why to write stories in [the introduction](./introduction.md#using-args). For details on how args work, read on.

## Args object

The args object can be defined at the story and component level (see below). It is an object with string keys, where values can have any type that is allowed to be passed into a component in your framework.

## Story args

To define the args of a single story, use the `args` CSF story key:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/button-story-with-args.js.mdx',
    'react/button-story-with-args.ts.mdx',
    'vue/button-story-with-args.2.js.mdx',
    'vue/button-story-with-args.3.js.mdx',
    'angular/button-story-with-args.ts.mdx',
    'svelte/button-story-with-args.js.mdx',
    'web-components/button-story-with-args.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

These args will only apply to the story for which they are attached, although you can [reuse](../workflows/build-pages-with-storybook.md#args-composition-for-presentational-screens) them via JavaScript object reuse:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-primary-long-name.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

In the above example, we use the [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) feature of ES 2015.

## Component args

You can also define args at the component level; such args will apply to all stories of the component unless they are overwritten. To do so, use the `args` key of the `default` CSF export:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/button-story-component-args-primary.js.mdx',
    'react/button-story-component-args-primary.ts.mdx',
    'vue/button-story-component-args-primary.js.mdx',
    'angular/button-story-component-args-primary.ts.mdx',
    'svelte/button-story-component-args-primary.js.mdx',
    'web-components/button-story-component-args-primary.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Args composition

You can separate the arguments to a story to compose in other stories. Here’s how args can be used in multiple stories for the same component.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-primary-composition.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

Note that if you are doing the above often, you may want to consider using [component-level args](#component-args).

</div>

Args are useful when writing stories for composite components that are assembled from other components. Composite components often pass their arguments unchanged to their child components, and similarly their stories can be compositions of their child components stories. With args, you can directly compose the arguments:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/page-story.js.mdx',
    'react/page-story.ts.mdx',
    'angular/page-story.ts.mdx',
    'vue/page-story.2.js.mdx',
    'vue/page-story.3.js.mdx',
    'svelte/page-story.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Args can modify any aspect of your component

Args are used in story templates to configure the component appearance just as you would in an application. Here’s an example of how a `footer` arg can be used to populate a child component.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/page-story-slots.js.mdx',
    'react/page-story-slots.ts.mdx',
    'vue/page-story-slots.2.js.mdx',
    'vue/page-story-slots.3.js.mdx',
    'angular/page-story-slots.ts.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

## Setting args through the URL

Initial args for the currently active story can be overruled by setting the `args` query parameter on the URL. Typically, you would use the Controls addon to handle this automatically, but you can also manually tweak the URL if desired. An example of Storybook URL query params could look like this:

```
?path=/story/avatar--default&args=style:rounded;size:100
```

In order to protect against [XSS](https://owasp.org/www-community/attacks/xss/) attacks, keys and values of args specified through the URL are limited to alphanumeric characters, spaces, underscores and dashes. Any args that don't abide these restrictions will be ignored and stripped, but can still be used through code and manipulated through the Controls addon.

The `args` param is always a set of `key:value` pairs delimited with a semicolon `;`. Values will be coerced (cast) to their respective `argTypes` (which may have been automatically inferred). Objects and arrays are supported. Special values `null` and `undefined` can be set by prefixing with a bang `!`. For example, `args=obj.key:val;arr[0]:one;arr[1]:two;nil:!null` will be interpreted as:

```
{
  obj: { key: 'val' },
  arr: ['one', 'two'],
  nil: null
}
```

Similarly, special formats are available for dates and colors. Date objects will be encoded as `!date(value)` with value represented as an ISO date string. Colors are encoded as `!hex(value)`, `!rgba(value)` or `!hsla(value)`. Note that rgb(a) and hsl(a) should not contain spaces or percentage signs in the URL.

Args specified through the URL will extend and override any default values of args specified on the story.

## Mapping to complex arg values

Complex values such as JSX elements cannot be serialized to the manager (e.g. the Controls addon) or synced with the URL. To work around this limitation, arg values can be "mapped" from a simple string to a complex type using the `mapping` property in `argTypes`. This works on any type of arg, but makes most sense when used with the `select` control type.

```
argTypes: {
  label: {
    options: ['Normal', 'Bold', 'Italic'],
    mapping: {
      Bold: <b>Bold</b>,
      Italic: <i>Italic</i>
    }
  }
}
```

Note that `mapping` does not have to be exhaustive. If the arg value is not a property of `mapping`, the value will be used directly. Keys in `mapping` always correspond to arg *values*, not their index in the `options` array.

<details>
<summary>Using args in addons</summary>

If you are [writing an addon](../addons/writing-addons.md) that wants to read or update args, use the `useArgs` hook exported by `@storybook/api`:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/args-usage-with-addons.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

</details>

<details>
<summary>parameters.passArgsFirst</summary>

In Storybook 6+, we pass the args as the first argument to the story function. The second argument is the “context” which contains things like the story parameters etc.

In Storybook 5 and before we passed the context as the first argument. If you’d like to revert to that functionality set the `parameters.passArgsFirst` parameter in [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-parameters-old-format.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

  <div class="aside">

Note that `args` is still available as a key on the context.

  </div>
</details>
