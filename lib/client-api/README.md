# `@storybook/client-api` -- APIs that control the rendering of stories in the preview iframe.

## Story store

The story store contains the list of stories loaded in a Storybook.

Each story is loaded via the `.add()` API and contains the follow attributes, which are available on the `context` (which is passed to the story's render function and decorators):

- `kind` - the grouping of the story, typically corresponds to a single component. Also known as the `title` in CSF.
- `name` - the name of the specific story.
- `id` - an unique, URL sanitized identifier for the story, created from the `kind` and `name`.
- `parameters` - static data about the story, see below.
- `args` - dynamic inputs to the story, see blow.
- `hooks` - listeners that will rerun when the story changes or is unmounted, see `@storybook/addons`.

## Parameters

The story parameters is a static, serializable object of data that provides details about the story. Those details can be used by addons or Storybook itself to render UI or provide defaults about the story rendering.

Parameters _cannot change_ and are syncronized to the manager once when the story is loaded (note over the lifetime of a development Storybook a story can be loaded several times due to hot module reload, so the parameters technically can change for that reason).

Usually addons will read from a single key of `parameters` namespaced by the name of that addon. For instance the configuration of the `backgrounds` addon is driven by the `parameters.backgrounds` namespace.

Parameters are inheritable -- you can set global parameters via `addParameters` (exported by `client_api` and each framework), at the component level by the `parameters` key of the component (default) export in CSF (or in `.storiesOf`), and on a single story via the `parameters` key on the story data, or the third argument to `.add()`.

Some notable parameters:

- `parameters.fileName` - the file that the story was defined in, when available
- `parameters.argsTypes` - type information about args (see below)

### Parameter enhancement

Ideally all parameters should be set _at build time_ of the Storybook, either directly by the user, or via the use of a webpack loader. (For an example of this, see `addon-storysource`, which writes to the `parameters.storysource` parameter with a set of static information about the story file).

However, in some cases it is necessary to set parameters at _load time_ when the Storybook first loads. This should be avoided if at all possible as it is cost that must be paid each time a Storybook loads, rather than just once when the Storybook is built.

To add a parameter enhancer, call `store.addParameterEnhancer(enhancer)` _before_ any stories are loaded (in addon registration or in `preview.js`). As each story is loaded, the enhancer will be called with the full story `context` -- the return value should be an object that will be patched into the Story's parameters.
Alm

## Args

Args are "inputs" to stories.

You can think of them equivalently to React props, Angular inputs and outputs, etc.

Changing the args cause the story to be re-rendered with the new set of args.

### Using args in a story

By default, args are passed to a story in the context; like parameters, they are available as `context.args`.

```js
const YourStory = ({ args: { x, y }}) => /* render your story using `x` and `y` */
```

If you set the `parameters.options.passArgsFirst` option on a story, then the args will be passed to the story as first argument and the context as second:

```js
const YourStory = ({ x, y } /*, context*/) => /* render your story using `x` and `y` */
```

### Using args in an addon

Args values are automatically syncronized (via the `changeStoryArgs` and `storyArgsChanged` events) between the preview and manager; APIs exist in `lib/api` to read and set args in the manager.

Args need to be serializable -- so currently cannot include callbacks (this may change in a future version).

Note that arg values are passed directly to a story -- you should only store the actual value that the story needs to render in the arg. If you need more complex information supporting that, use parameters or addon state.

### Default values

The initial value of an arg is driven by the `parameters.argTypes` field. For each key in that field, if a `defaultValue` exists, then the arg will be initialized to that value.

For instance, for this story:

```js
export MyStory = ....
MyStory.story = { parameters: {
  argTypes: {
    primary: { defaultValue: true },
    size: { defaultValue: 'large' },
    color: { /* other things */ },
  },
}}
```

Then `context.args` will default to `{ primary: true, size: large }`
