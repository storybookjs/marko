# Server Kitchen Sink

This project demonstrates a standalone server using `@storybook/server`.

To run the server:

```
yarn start
```

This starts an express server on port `1337`.

To view the stories in the storybook UI:

```
cd ../official-storybook
yarn storybook --preview-url=http://localhost:1337/storybook_preview
```

This runs the Storybook dev server, but instead of showing `official-storybook`'s stories, it attaches to the server, lists its stories in the navigation, and shows its stories in the preview iframe.
