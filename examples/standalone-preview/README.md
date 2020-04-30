# Standalone Preview

This project demonstrates a preview running in standalone mode using `parcel`.

To run the standalone preview:

```
yarn storybook
```

This starts a `parcel` dev server on port `1337`.

To view the stories in the storybook UI:

```
cd ../official-storybook
npm storybook -- --preview-url=http://localhost:1337/iframe.html # or yarn
```

This runs the Storybook dev server, but instead of showing `official-storybook`'s stories, it attaches to the `parcel` dev server, lists its stories in the navigation, and shows its stories in the preview iframe.

> NOTE: This can be run from any working storybook, not just `official-storybook`!
