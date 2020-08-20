---
title: 'Unit testing with Storybook'
---

Unit tests are useful for verifying functional aspects of components. They verify that the output of a component remains the same given a fixed input.

![Unit testing with a component](./component-unit-testing.gif)

Thanks to the [CSF format](../api/csf), your stories are reusable in unit testing tools. Each [named export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) is “renderable” without depending on Storybook. That means your testing framework will also be able to render that story.

Here is an example of how you can use it in a testing library:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/button-test.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Unit tests can be brittle and expensive to maintain for _every_ component. We recommend combining unit tests with other testing methods like [visual regression testing](./visual-testing.md) for comprehensive coverage with less maintenance work.
