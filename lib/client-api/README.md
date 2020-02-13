# `@storybook/client-api` -- APIs that control the rendering of stories in the preview iframe.

## Story store

The story store contains the list of stories loaded in a Storybook.

Each story is loaded via the `.add()` API and contains the follow attributes, which are available on the `context` (which is passed to the story's render function and decorators):

- `kind` - the grouping of the story, typically corresponds to a single component. Also known as the `title` in CSF.
- `name` - the name of the specific story.
- `id` - an unique, URL sanitized identifier for the story, created from the `kind` and `name`.
- `parameters` - static data about the story, see below.
- `properties` - dynamic inputs to the story, see blow.
- `hooks` - listeners that will rerun when the story changes or is unmounted, see `@storybook/addons`.

## Parameters

The story parameters is a static, serializable object of data that provides details about the story. Those details can be used by addons or Storybook itself to render UI or provide defaults about the story rendering.

Parameters _cannot change_ and are syncronized to the manager once when the story is loaded (note over the lifetime of a development Storybook a story can be loaded several times due to hot module reload, so the parameters technically can change for that reason).

Usually addons will read from a single key of `parameters` namespaced by the name of that addon. For instance the configuration of the `backgrounds` addon is driven by the `parameters.backgrounds` namespace.

Parameters are inheritable -- you can set global parameters via `addParameters` (exported by `client_api` and each framework), at the component level by the `parameters` key of the component (default) export in CSF (or in `.storiesOf`), and on a single story via the `parameters` key on the story data, or the third argument to `.add()`.

Some notable parameters:

- `fileName` - the file that the story was defined in, when available
- `properties` - type information about properties (see below)
