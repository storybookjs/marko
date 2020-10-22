---
title: 'Args'
---

A story is a component with a set of arguments (props, slots, inputs, etc). “Args” are Storybook’s mechanism for defining those arguments as a first class entity that’s machine readable. This allows Storybook and its addons to live edit components. You _do not_ need to change your underlying component code to use args.

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
    'vue/button-story-with-args.js.mdx',
    'angular/button-story-with-args.ts.mdx',
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
    'vue/page-story.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

<details>
<summary>Using args in addons</summary>

If you are [writing an addon](../api/addons.md) that wants to read or update args, use the `useArgs` hook exported by `@storybook/api`:

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
