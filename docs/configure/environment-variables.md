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

### Using .env files

You can also use `.env` files to change Storybook's behavior in different modes. For example, if you add a `.env` file to your project with the following:

```
STORYBOOK_DATA_KEY=12345
```

Then you can access this environment variable anywhere, even within your stories:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/my-component-with-env-variables.js.mdx',
    'react/my-component-with-env-variables.ts.mdx',
    'react/my-component-with-env-variables.mdx.mdx',
    'vue/my-component-with-env-variables.js.mdx',
    'angular/my-component-with-env-variables.ts.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">
You can also use specific files for specific modes. Add a <code>.env.development</code> or <code>.env.production</code> to apply different values to your environment variables.
</div>

You can also pass these environment variables when you are [building your Storybook](../workflows/publish-storybook.md) with `build-storybook`.

Then they'll be hard coded to the static version of your Storybook.

### Using environment variables to choose the browser

Storybook allows you to choose the browser you want to preview your stories. Either through an `.env` file entry or directly in your `storybook` script.

The table below lists the available options:

| Browser  | Example              |
|----------|----------------------|
| Safari   | `BROWSER="safari"`   |
| Firefox  | `BROWSER="firefox"`  |
| Chromium | `BROWSER="chromium"` |

<div class="aside">
Note: By default Storybook will open a new Chrome window as part of its startup process. If you don't have Chrome installed, make sure to include one of the following options, or set your default browser accordingly.
</div>