---
title: 'Environment variables'
---

You can use environment variables in Storybook to change its behaviour in different “modes”.
If you supply an environment variable prefixed with `STORYBOOK_`, it will be available in `process.env`:

```shell
STORYBOOK_THEME=red STORYBOOK_DATA_KEY=12345 npm run storybook
```

Then we can access these environment variables anywhere inside our preview JavaScript code like below:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-read-environment-variables.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

You can also access these variables in your custom `<head>`/`<body>` using the substitution `%STORYBOOK_X%`, for example: `%STORYBOOK_THEME%` will become `red`.

<div class="aside">

If using the environment variables as attributes or values in JavaScript, you may need to add quotes, as the value will be inserted directly. e.g. `<link rel="stylesheet" href="%STORYBOOK_STYLE_URL%" />`

</div>

You can also pass these environment variables when you are [building your Storybook](../workflows/publish-storybook.md) with `build-storybook`.

Then they'll be hard coded to the static version of your Storybook.