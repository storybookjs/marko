---
title: 'Images and assets'
---

Components often rely on images, videos, and other assets to render as the user expects. There are many ways to use these assets in your story files.

### Import assets into stories

You can import any media assets by importing (or requiring) them. This works out of the box with our default config. But, if you are using a custom webpack config, you’ll need to add the file-loader to handle the required files.

Afterwards you can use any asset in your stories:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/component-story-static-asset-with-import.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Serving static files via Storybook

We recommend serving static files via Storybook to ensure that your components always have the assets they need to load.

Configure a directory (or a list of directories) where your assets live when starting Storybook. Use the`-s` flag in your npm script like so:

```json
{
    "scripts": {
        "start-storybook": "start-storybook -s ./public -p 9001"
    }
}
```

Here `./public` is your static directory. Now use it in a component or story like this.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/component-story-static-asset-without-import.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

You can also pass a list of directories separated by commas without spaces instead of a single directory.

```json
{
    "scripts": {
        "start-storybook": "start-storybook -s ./public,./static -p 9001"
    }
}
```

### Reference assets from a CDN

Upload your files to an online CDN and reference them. In this example we’re using a placeholder image service.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/component-story-static-asset-cdn.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Absolute versus relative paths

Sometimes, you may want to deploy your storybook into a subpath, like `https://example.com/storybook`.

In this case, you need to have all your images and media files with relative paths. Otherwise, the browser cannot locate those files.

If you load static content via importing, this is automatic and you do not have to do anything.

If you are serving assets in a [static directory](#serving-static-files-via-storybook) along with your Storybook, then you need to use relative paths to load images or use the base element.
