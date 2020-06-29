# Storybook for Server

---

Storybook for Server is a UI development environment for your plain HTML snippets rendered by your server backend.
With it, you can visualize different states of your UI components and develop them interactively.

![Storybook Screenshot](https://github.com/storybookjs/storybook/blob/master/media/storybook-intro.gif)

Storybook runs outside of your app.
So you can develop UI components in isolation without worrying about app specific dependencies and requirements.

## Getting Started

```sh
cd my-app
npx -p @storybook/cli sb init -t server
```

To configure the server that Storybook will connect to, export a global parameter `parameters.server.url` in `.storybook/preview.js`:

```js
export const parameters = {
  server: {
    url: `http://localhost:${port}/storybook_preview`,
  },
};
```

The URL you connect to should have the ability to render a story, see [server rendering](#server-rendering) below.

For more information visit: [storybook.js.org](https://storybook.js.org)

## Writing Stories

To write a story, use whatever API is natural for your server-side rendering framework to generate set of JSON files of stories analogous to CSF files (see the [`server-kitchen-sink`](../../server-kitchen-sink/stories) example for ideas):

```json
{
  // Top level keys on the JSON file correspond to the default export in CSF
  "title": "Component",
  "parameters": {
    "options": { "component": "parameters" }
  },
  "stories": [
    {
      "name": "Default",
      "parameters": {
        // Provide an id here if you don't want to use SB's built in story ids.
        "server": { "id": "path/of/your/story" }
      }
    }
  ]
}
```

In your `.storybook/main.js` you simply provide a glob specifying the location of those JSON files, e.g.

```js
module.exports = {
  stories: ['../stories/**/*.stories.json'],
};
```

Notice that the JSON does not specify a rendering function -- `@storybook/server` will instead call your `parameters.server.url` with the story's server id appended.

### Ruby/Rails support

In particular the [View Component::Storybook](https://github.com/jonspalmer/view_component_storybook) gem provides a Ruby API for easily creating the above with a Ruby/Rails DSL (as well as providing a server rendering endpoint).

## Server rendering

The server rendering side of things is relatively straightfoward. When you browse to a story in the sidebar, Storybook will make a `fetch` request to `\`\${parameters.server.url}/{parameters.server.id}\`` and display the HTML that is returned.

So you simply need to ensure the route in your server app renders the appropriate HTML when called in that fashion.

## Addon compatibility

Storybook also comes with a lot of [addons](https://storybook.js.org/addons/introduction) and a great API to customize as you wish. As some addons assume the story is rendered in JS, they may not work with `@storybook/server` (yet!).

Many addons that act on the manager side (such as `backgrounds` and `viewport`) will work out of the box with `@storybook/server` -- you can configure them with parameters written on the server as usual.

Some addons work in specific ways:

### Knobs

> Note this functionality will likely be deprecated in favor of args support in the near future.

To configure knobs, add a special `"knobs"` key to the story JSON:

```json:
"knobs": [
  { "type": "text", "name": "Name", "value": "John Doe", "param": "name"},
  { "type": "number", "name": "Age", "value": 44, "param": "age"}
]
```

The knobs values will be added to your story URL as query parameters.

### Actions

To use actions, use the `parameters.actions.handles` parameter:

```json
"actions": {
  "handles": ["mouseover", "click .btn"]
}
```
