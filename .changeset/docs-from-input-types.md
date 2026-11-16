---
"@storybook/marko": minor
"@storybook/marko-vite": minor
"@storybook/marko-webpack": minor
---

Generate controls and autodocs from each component's exported `Input` type. With docs enabled, a doc comment on `Input` becomes the component's description, and every prop's JSDoc description, `@default`, type and required-ness fills the args table, including the nested members of attribute tags. Unions of literals become option controls, top-level `onFoo` handlers log to the Actions panel under an "Events" category, a `fooChange` handler next to `foo` makes `foo` controllable, and props inherited from outside the project (eg `extends Marko.HTML.Button`) are left out. `argTypes` in stories still override anything extracted. Set `docgen: false` in the framework's options to turn extraction off.
