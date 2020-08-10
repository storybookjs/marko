---
title: 'Interaction testing with Storybook'
---

Stories are useful for verifying the known states of a component. But sometimes you need to test how a component changes in response to user interaction.

Stories are convenient **starting points** and **harnesses** for interaction tests using end-to-end tools like [Enzyme](https://enzymejs.github.io/enzyme/) and [Cypress](https://www.cypress.io/).

Luckily, this is straightforward. Point your interaction testing tool at Storybook’s isolated iframe [URL for a specific story](../configure/user-interface.md#permalinking-to-stories) then execute the test script as usual. Here’s an example using Cypress:

```js
// My-component_spec.js

describe('My Component', () => {
  it('should respond to click on button with warning', () => {
	cy.visit('http://localhost:6006/iframe.html?id=my-component--basic-story’);
	cy.get('#button').click();
	cy.get('#warning').should('contain.text', 'You need to fill in the form!');
  });
})
```
