# Storybook Core

This package contains common data structures and bootstrapping capabilities
used among the different frameworks
(React, RN, Vue, Ember, Angular, etc).

## Preview

The files in `src/client/preview` alongside the `@storybook/client-api` package form the "API" of the preview (iframe) side of Storybook. Here is a brief overview of the architecture:

Each framework (e.g. `@storybook/react` / `@storybook/angular` / et al.) initializes the preview by calling into `src/client/preview/start.ts`, passing a `render` function that will be used to render stories.

The `start` module initiaizes all the submodules:

- `StoryStore` (from `@storybook/client-api`) - stores the stories and their state as well as the current selection or error.
- `ClientApi` (from `@storybook/client-api`) - provides the entry point for `storiesOf()` API calls; re-exported by each framework.
- `ConfigApi` (from `@storybook/client-api`) - provides the configure API (wrapped by `loadCsf` below).
- `StoryRenderer` - controls the HTML that is rendered in the preview (calling the `render` function with the current story at appropriate times).
- `url.js` - controls the URL in the preview and sets the selection based on it.
- `loadCsf` - loads CSF files from `require.context()` calls and uses `ClientApi` to load them into the store.

Each module uses the channel to communicate with each other and the manager. Each module also has direct access to the story store.

### Events on startup

The store can only be changed during "configuration". The `ConfigApi` will call `store.startConfiguration()`, then the user code (or `loadCsf`'s loader) which will use client API to load up stories. At the end of the user's code the `ConfigApi` will call `store.finishConfiguration()`. At this point the `SET_STORIES` event is emitted and the stories are transmitted to the manager.

The `SET_CURRENT_STORY` "command" event can be used to set the selection on the store. However only once this has been recieved _and_ configuration is over will the store use the `RENDER_CURRENT_STORY` to tell the `StoryRenderer` to render it.
