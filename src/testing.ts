import addons, {
  mockChannel,
  ArgTypes,
  Parameters,
  BaseDecorators,
} from "@storybook/addons";
import { defaultDecorateStory, combineParameters } from "@storybook/client-api";
import type {
  StoryContext,
  Meta,
  Story,
  StoryFn,
  StoryFnMarkoReturnType,
} from "./types";
export type {
  Args,
  ArgTypes,
  Parameters,
  StoryContext,
  Meta,
  Story,
  StoryFnMarkoReturnType,
} from "./types";

/**
 * Object representing the preview.ts module
 *
 * Used in storybook testing utilities.
 */
export type GlobalConfig = {
  decorators?: BaseDecorators<StoryFnMarkoReturnType>;
  parameters?: Parameters;
  argTypes?: ArgTypes;
  [key: string]: any;
};

// Since Marko templates are untyped (so far), this adds some basic types to the render functions
// and also includes the story context data.
interface RenderableStory<T extends Story<any>> extends StoryContext {
  renderSync(input?: T extends Story<infer P> ? P : never, ...args: any[]): any;
  renderToString(
    input?: T extends Story<infer P> ? P : never,
    ...args: any[]
  ): any;
  render(input?: T extends Story<infer P> ? P : never, ...args: any[]): any;
  stream(input?: T extends Story<infer P> ? P : never, ...args: any[]): any;
}

let globalStorybookConfig: GlobalConfig = {};
const pass = () => true;
const fail = () => false;
const emptyObj: any = {};
const emptyArr: any = [];
const renderMethods = new Set([
  "renderSync",
  "render",
  "renderToString",
  "stream",
]);

// Some addons use the channel api to communicate between manager/preview, and this is a client only feature, therefore we must mock it.
addons.setChannel(mockChannel());

/**
 * @description
 * Function that sets the globalConfig of your storybook. The global config is the preview module of your .storybook folder.
 *
 * It should be run a single time, so that your global config (e.g. decorators) is applied to your stories when using `composeStories` or `composeStory`.
 *
 * @example
 *```js
 * // setup.js (for jest)
 * import { setGlobalConfig } from '@storybook/marko/testing';
 * import * as globalStorybookConfig from './.storybook/preview';
 *
 * setGlobalConfig(globalStorybookConfig);
 *```
 *
 * @param config - e.g. (import * as globalConfig from '../.storybook/preview')
 */
export function setGlobalConfig(config: GlobalConfig) {
  globalStorybookConfig = config;
}

/**
 * @description
 * Creates a proxy to the Marko component that would be rendered by the story.
 * When the proxy component is rendered, any storybook args will be merged in as
 * the input to the component.
 *
 *
 * @example
 *```js
 * import { render, screen } from '@marko/testing-library';
 * import { composeStory } from '@storybook/marko/testing';
 * import Meta, { Primary as PrimaryStory } from './Button.stories';
 *
 * const Primary = composeStory(PrimaryStory, Meta);
 * // Primary is a proxy to a normal Marko template that can be rendered.
 * // You can also access properties in the story context on this proxy, eg `Primary.argTypes`.
 *
 * test('renders primary button with Hello World', async () => {
 *   await render(Primary, { label: "Hello World" });
 *   expect(screen.getByText(/Hello world/i)).toBeInTheDocument();
 * });
 *```
 *
 * @param story
 * @param meta - e.g. (import Meta from './Button.stories')
 * @param [globalConfig] - e.g. (import * as globalConfig from '../.storybook/preview') this can be applied automatically if you use `setGlobalConfig` in your setup files.
 */
export function composeStory<GenericArgs>(
  story: Story<GenericArgs>,
  meta: Meta = emptyObj,
  globalConfig: GlobalConfig = globalStorybookConfig
) {
  if (!story) {
    throw new Error("No story provided.");
  }

  if (!(typeof story === "function" || typeof story === "object")) {
    throw new Error(`Invalid story provided, got ${story}.`);
  }

  if ((story as any).story !== undefined) {
    throw new Error(
      `StoryFn.story object-style annotation is not supported. @storybook/marko/testing expects hoisted CSF stories.
       https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#hoisted-csf-annotations`
    );
  }

  const render =
    typeof story === "function"
      ? (story as StoryFn<GenericArgs>)
      : story.render || ((input: any) => ({ input }));
  const decorated = defaultDecorateStory(
    ((context: StoryContext) =>
      toRenderable(
        render(context.args as GenericArgs, context),
        context
      )) as any,
    [
      ...(story.decorators || emptyArr),
      ...(meta.decorators || emptyArr),
      ...(globalConfig.decorators || emptyArr),
    ]
  );

  return decorated({
    id: "",
    kind: "",
    name: "",
    story: "",
    title: "",
    componentId: "",
    viewMode: "story",
    originalStoryFn: story,
    component: meta.component,
    args: {
      ...meta.args,
      ...story.args,
    },
    globals: globalConfig.globalTypes
      ? Object.fromEntries(
          Object.entries(globalConfig.globalTypes)
            .filter(([, v]) => "defaultValue" in (v as any))
            .map(([k, v]) => [k, (v as any).defaultValue])
        )
      : {},
    argTypes: combineParameters(
      globalConfig.argTypes,
      meta.argTypes,
      story.argTypes
    ),
    parameters: combineParameters(
      globalConfig.parameters,
      meta.parameters,
      story.parameters
    ),
  } as StoryContext) as RenderableStory<Story<GenericArgs>>;
}

/**
 * @description
 * Function that will receive a stories import (e.g. `import * as stories from './Button.stories'`)
 * and optionally a globalConfig (e.g. `import * from '../.storybook/preview`)
 * and will return an object containing all the stories passed converted into a proxy to their related Marko components.
 * All args/parameters/decorators/etc are combined and applied to it, and args will be automatically merged in
 * when the template is rendered.
 *
 *
 * @example
 *```js
 * import { render, screen } from '@marko/testing-library';
 * import { composeStories } from '@storybook/marko/testing';
 * import * as stories from './Button.stories';
 *
 * const { Primary, Secondary } = composeStories(stories);
 * // Primary is a proxy to a normal Marko template that can be rendered.
 * // You can also access properties in the story context on this proxy, eg `Primary.argTypes`.
 *
 * test('renders primary button with Hello World', async () => {
 *   await render(Primary, { label: "Hello World" });
 *   expect(screen.getByText(/Hello world/i)).toBeInTheDocument();
 * });
 *```
 *
 * @param storiesImport - e.g. (import * as stories from './Button.stories')
 * @param [globalConfig] - e.g. (import * as globalConfig from '../.storybook/preview') this can be applied automatically if you use `setGlobalConfig` in your setup files.
 */
export function composeStories<T extends { default?: Meta }>(
  storiesImport: T,
  globalConfig?: GlobalConfig
) {
  const { default: meta = emptyObj, ...stories } = storiesImport;
  type Stories = typeof stories;

  const composedStories = {} as any;
  const includeTest = patternToTest(meta.includeStories) || pass;
  const excludeTest = patternToTest(meta.excludeStories) || fail;
  for (const key in stories) {
    const story = stories[key as keyof Stories] as any;

    if (
      story &&
      (typeof story === "function" || typeof story === "object") &&
      includeTest(key) &&
      !excludeTest(key)
    ) {
      composedStories[key] = composeStory(story, meta, globalConfig);
    }
  }

  return composedStories as {
    [Key in {
      [Key in keyof Stories]: Stories[Key] extends Story ? Key : never;
    }[keyof Stories]]: RenderableStory<Stories[Key]>;
  };
}

/**
 * Creates a proxy to the component that would be rendered from a story function result.
 * When the component is ultimately rendered, all storybook args will be merged into the input.
 *
 * Properties that exist on the story context are also accessible through the proxy.
 */
function toRenderable<T extends StoryFnMarkoReturnType>(
  storyResult: T,
  context: StoryContext
) {
  const component = storyResult?.component || context.component;
  if (!component) {
    throw new Error(
      "@storybook/marko/testing: Story function result does not have a component."
    );
  }

  return new Proxy(component, {
    get(target, prop, receiver) {
      if (renderMethods.has(prop as string)) {
        const fn = Reflect.get(target, prop, receiver);
        return function (this: typeof component, ...args: unknown[]) {
          // When we've got a render function being called `input` will be the first argument.
          // We merge in the resolved `input` from the story function with any `input` provided
          // by the user when rendering.
          args[0] = {
            ...storyResult.input,
            ...(args[0] as Record<string, unknown>),
          };
          return Reflect.apply(fn, this, args);
        };
      } else if (prop in context) {
        // Any properties on the story context we'll forward through.
        return context[prop as keyof StoryContext];
      }

      return Reflect.get(target, prop, receiver);
    },
  });
}

/**
 * Roughly the same as https://github.com/storybookjs/storybook/blob/ee22b3957f3d48bb613f9ba93e092c0cb04ccf8e/lib/csf-tools/src/CsfFile.ts#L25-L37
 */
function patternToTest(
  pattern: undefined | null | string | string[] | RegExp | RegExp[]
) {
  if (pattern) {
    switch (typeof pattern) {
      case "string":
        return (v: string) => v === pattern;
      case "object":
        return Array.isArray(pattern)
          ? (v: string) => {
              for (const item of pattern) {
                if (typeof item === "string") {
                  if (v === item) return true;
                } else if (item.test(v)) {
                  return true;
                }
              }

              return false;
            }
          : pattern.test.bind(pattern);
      default:
        throw new Error(`Invalid pattern ${pattern}`);
    }
  }
}
