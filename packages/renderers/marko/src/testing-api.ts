import { deprecate } from "@storybook/client-logger";
import {
  composeStories as originalComposeStories,
  composeStory as originalComposeStory,
  setProjectAnnotations as originalSetProjectAnnotations,
} from "@storybook/preview-api";
import type {
  Args,
  ComposedStoryFn,
  Store_CSFExports,
  StoryAnnotationsOrFn,
} from "@storybook/types";

import { decorateStory } from "./decorators";
import type { Meta, Story, Preview } from "./public-types";
import { render } from "./render";
import type { MarkoRenderer } from "./types";

type StoryInputForExport<Exports> = Exports extends Story<infer Input>
  ? Input
  : never;

export type ComposedStories<Exports> = {
  [Key in Exclude<keyof Exports, keyof Store_CSFExports>]: ComposedStory<
    Exports[Key]
  >;
};

export type ComposedStory<Export> = ComposedStoryFn<
  MarkoRenderer,
  StoryInputForExport<Export>
> &
  Marko.Template<StoryInputForExport<Export>>;

/** Function that sets the globalConfig of your storybook. The global config is the preview module of your .storybook folder.
 *
 * It should be run a single time, so that your global config (e.g. decorators) is applied to your stories when using `composeStories` or `composeStory`.
 *
 * Example:
 *```jsx
 * // setup.js (for jest)
 * import { setProjectAnnotations } from '@storybook/marko';
 * import projectAnnotations from './.storybook/preview';
 *
 * setProjectAnnotations(projectAnnotations);
 *```
 *
 * @param projectAnnotations - e.g. (import projectAnnotations from '../.storybook/preview')
 */
export function setProjectAnnotations(projectAnnotations: Preview | Preview[]) {
  originalSetProjectAnnotations<MarkoRenderer>(projectAnnotations);
}

/** Preserved for users migrating from `@storybook/marko@7`.
 *
 * @deprecated Use setProjectAnnotations instead
 */
export function setGlobalConfig(projectAnnotations: Preview | Preview[]) {
  deprecate(
    `setGlobalConfig is deprecated. Use setProjectAnnotations instead.`,
  );
  setProjectAnnotations(projectAnnotations);
}

// This will not be necessary once we have auto preset loading
const defaultProjectAnnotations: Preview = {
  render,
  applyDecorators: decorateStory,
};

/**
 * Function that will receive a story along with meta (e.g. a default export from a .stories file)
 * and optionally projectAnnotations e.g. (import * from '../.storybook/preview)
 * and will return a composed component that has all args/parameters/decorators/etc combined and applied to it.
 *
 *
 * It's very useful for reusing a story in scenarios outside of Storybook like unit testing.
 *
 * Example:
 *```jsx
 * import { composeStory } from '@storybook/marko';
 * import { render, screen } from '@testing-library/marko';
 * import Meta, { Primary as PrimaryStory } from './Button.stories';
 *
 * const Primary = composeStory(PrimaryStory, Meta);
 *
 * test('renders primary button with Hello World', () => {
 *   await render(Primary, { text: 'Hello world' });
 *   expect(screen.getByText(/Hello world/i)).not.toBeNull();
 * });
 *```
 *
 * @param story
 * @param componentAnnotations - e.g. (import Meta from './Button.stories')
 * @param [projectAnnotations] - e.g. (import * as projectAnnotations from '../.storybook/preview') this can be applied automatically if you use `setProjectAnnotations` in your setup files.
 * @param [exportsName] - in case your story does not contain a name and you want it to have a name.
 */
export function composeStory<
  Input extends Args = Args,
  Export extends StoryAnnotationsOrFn<
    MarkoRenderer,
    Input
  > = StoryAnnotationsOrFn<MarkoRenderer, Input>,
>(
  story: Export,
  componentAnnotations: Meta<Input>,
  projectAnnotations?: Preview,
  exportsName?: string,
): ComposedStory<Export> {
  return toRenderable(
    originalComposeStory<MarkoRenderer, Input>(
      story as any,
      componentAnnotations,
      projectAnnotations,
      defaultProjectAnnotations,
      exportsName,
    ),
    componentAnnotations,
  ) as any;
}

/**
 * Function that will receive a stories import (e.g. `import * as stories from './Button.stories'`)
 * and optionally projectAnnotations (e.g. `import * from '../.storybook/preview`)
 * and will return an object containing all the stories passed, but now as a composed component that has all args/parameters/decorators/etc combined and applied to it.
 *
 *
 * It's very useful for reusing stories in scenarios outside of Storybook like unit testing.
 *
 * Example:
 *```jsx
 * import { composeStories } from '@storybook/marko';
 * import { render, screen } from '@testing-library/marko';
 * import * as stories from './Button.stories';
 *
 * const { Primary, Secondary } = composeStories(stories);
 *
 * test('renders primary button with Hello World', async () => {
 *   await render(Primary, { text: 'Hello world' });
 *   expect(screen.getByText(/Hello world/i)).not.toBeNull();
 * });
 *```
 *
 * @param csfExports - e.g. (import * as stories from './Button.stories')
 * @param [projectAnnotations] - e.g. (import * as projectAnnotations from '../.storybook/preview') this can be applied automatically if you use `setProjectAnnotations` in your setup files.
 */
export function composeStories<Exports>(
  csfExports: Exports,
  projectAnnotations?: Preview,
): ComposedStories<Exports> {
  return (originalComposeStories as any)(
    csfExports,
    projectAnnotations,
    composeStory,
  );
}

/**
 * Creates a proxy to the component that would be rendered from a story function result.
 * When the component is ultimately rendered, all storybook args will be merged into the input.
 *
 * Properties that exist on the story context are also accessible through the proxy.
 */
function toRenderable<Input extends Args = Args>(
  composed: ComposedStoryFn<MarkoRenderer, Partial<Input>>,
  componentAnnotations: Meta<Input>,
) {
  return {
    ...composed,
    createOut() {
      throw new Error(`Cannot use createOut on a composed story.`);
    },
    render(
      rawInput: Partial<Marko.TemplateInput<Input>> | undefined,
      cb?: any,
    ) {
      const { component, input } = runStory(rawInput);
      return component.render(input, cb);
    },
    renderSync(rawInput: Partial<Marko.TemplateInput<Input>> | undefined) {
      const { component, input } = runStory(rawInput);
      return component.renderSync(input);
    },
    renderToString(
      rawInput: Partial<Marko.TemplateInput<Input>> | undefined,
      cb?: any,
    ) {
      const { component, input } = runStory(rawInput);
      return (component as any).renderToString(input!, cb);
    },
    stream(rawInput: Partial<Marko.TemplateInput<Input>> | undefined) {
      const { component, input } = runStory(rawInput);
      return component.stream(input);
    },
  } satisfies Marko.Template<Input>;

  function runStory(rawInput: Partial<Marko.TemplateInput<Input>> | undefined) {
    const { component = componentAnnotations?.component, input = {} } =
      composed(rawInput) || {};
    if (!component || !component.renderSync) {
      throw new Error(
        `Expecting a Marko template to be returned from the story: "${composed.id}".`,
      );
    }

    return {
      component,
      input,
    };
  }
}
