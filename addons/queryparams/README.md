# storybook-addon-queryparams

This storybook addon can be helpful if your components need special query parameters to work the way you want them.

## Getting started

First, install the addon.

```sh
$ yarn add @storybook/addon-queryparams --dev
```

Add this line to your `main.js` file (create this file inside your storybook config directory if needed).

```js
module.exports = {
  addons: ['@storybook/addon-queryparams'],
};
```

```js
import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('button', module)
  .addParameters({
    query: {
      mock: true,
    }
  })
  .add('Prints the document.search', () => (
    <div>
      This is the current document.search: {document.search}, it includes `mock`!
    </div>
  ));
```
