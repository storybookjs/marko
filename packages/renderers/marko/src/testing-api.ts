import {
  composeStories as originalComposeStories,
  composeStory as originalComposeStory,
  setProjectAnnotations as originalSetProjectAnnotations,
} from "@storybook/preview-api";
import type {
  Args,
  ComposedStoryFn,
  ProjectAnnotations,
  Store_CSFExports,
  StoryAnnotationsOrFn,
} from "@storybook/types";
import { deprecate } from "@storybook/client-logger";

import { render } from "./render";
import type { Meta } from "./public-types";
import type { MarkoRenderer } from "./types";

export type ComposedStories<StoryExports> = {
  [Key in Exclude<keyof StoryExports, keyof Store_CSFExports>]: ComposedStory<
    StoryExports[Key]
  >;
};

export type ComposedStory<StoryExport = StoryAnnotationsOrFn<MarkoRenderer>> =
  StoryExport extends StoryAnnotationsOrFn<
    MarkoRenderer<infer Input>,
    infer Input
  >
    ? ComposedStoryFn<MarkoRenderer<Input>, Partial<Input>> &
        Marko.Template<Input>
    : never;

/** Function that sets the globalConfig of your storybook. The global config is the preview module of your .storybook folder.
 *
 * It should be run a single time, so that your global config (e.g. decorators) is applied to your stories when using `composeStories` or `composeStory`.
 *
 * Example:
 *```jsx
 * // setup.js (for jest)
 * import { setProjectAnnotations } from '@storybook/marko/testing';
 * import projectAnnotations from './.storybook/preview';
 *
 * setProjectAnnotations(projectAnnotations);
 *```
 *
 * @param projectAnnotations - e.g. (import projectAnnotations from '../.storybook/preview')
 */
export function setProjectAnnotations(
  projectAnnotations:
    | ProjectAnnotations<MarkoRenderer>
    | ProjectAnnotations<MarkoRenderer>[],
) {
  originalSetProjectAnnotations<MarkoRenderer>(projectAnnotations);
}

/** Preserved for users migrating from `@storybook/marko/testing@7`.
 *
 * @deprecated Use setProjectAnnotations instead
 */
export function setGlobalConfig(
  projectAnnotations:
    | ProjectAnnotations<MarkoRenderer>
    | ProjectAnnotations<MarkoRenderer>[],
) {
  deprecate(
    `setGlobalConfig is deprecated. Use setProjectAnnotations instead.`,
  );
  setProjectAnnotations(projectAnnotations);
}

// This will not be necessary once we have auto preset loading
const defaultProjectAnnotations: ProjectAnnotations<MarkoRenderer<any>> = {
  render,
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
 * import { render } from '@testing-library/marko';
 * import { composeStory } from '@storybook/marko/testing';
 * import Meta, { Primary as PrimaryStory } from './Button.stories';
 *
 * const Primary = composeStory(PrimaryStory, Meta);
 *
 * test('renders primary button with Hello World', () => {
 *   const { getByText } = render(<Primary>Hello world</Primary>);
 *   expect(getByText(/Hello world/i)).not.toBeNull();
 * });
 *```
 *
 * @param story
 * @param componentAnnotations - e.g. (import Meta from './Button.stories')
 * @param [projectAnnotations] - e.g. (import * as projectAnnotations from '../.storybook/preview') this can be applied automatically if you use `setProjectAnnotations` in your setup files.
 * @param [exportsName] - in case your story does not contain a name and you want it to have a name.
 */
export function composeStory<Input extends Args = Args>(
  story: StoryAnnotationsOrFn<MarkoRenderer<Input>, Input>,
  componentAnnotations: Meta<Input>,
  projectAnnotations?: ProjectAnnotations<MarkoRenderer<any>>,
  exportsName?: string,
): ComposedStory<typeof story> {
  return toRenderable(
    originalComposeStory<MarkoRenderer<Input>, Input>(
      story as StoryAnnotationsOrFn<MarkoRenderer<Input>, Args>,
      componentAnnotations,
      projectAnnotations,
      defaultProjectAnnotations,
      exportsName,
    ),
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
 * import { render } from '@testing-library/marko';
 * import { composeStories } from '@storybook/marko/testing';
 * import * as stories from './Button.stories';
 *
 * const { Primary, Secondary } = composeStories(stories);
 *
 * test('renders primary button with Hello World', () => {
 *   const { getByText } = render(<Primary>Hello world</Primary>);
 *   expect(getByText(/Hello world/i)).not.toBeNull();
 * });
 *```
 *
 * @param csfExports - e.g. (import * as stories from './Button.stories')
 * @param [projectAnnotations] - e.g. (import * as projectAnnotations from '../.storybook/preview') this can be applied automatically if you use `setProjectAnnotations` in your setup files.
 */
export function composeStories<
  Exports extends Store_CSFExports<MarkoRenderer, any>,
>(
  csfExports: Exports,
  projectAnnotations?: ProjectAnnotations<MarkoRenderer>,
): ComposedStories<Exports> {
  const composedStories = (originalComposeStories as any)(
    csfExports,
    projectAnnotations,
    composeStory,
  );

  return Object.fromEntries(
    Object.entries(composedStories).map(([key, value]) => [
      key,
      toRenderable(value as any),
    ]),
  ) as any;
}

/**
 * Creates a proxy to the component that would be rendered from a story function result.
 * When the component is ultimately rendered, all storybook args will be merged into the input.
 *
 * Properties that exist on the story context are also accessible through the proxy.
 */
function toRenderable<Input extends Args = Args>(
  composed: ComposedStoryFn<MarkoRenderer<Input>, Partial<Input>>,
) {
  return {
    ...composed,
    createOut() {
      throw new Error(`Cannot use createOut on a composed story.`);
    },
    render(rawInput: Partial<Marko.TemplateInput<Input>> | undefined, cb: any) {
      const { component, input } = composed(rawInput);
      assertIsTemplate(
        component,
        `Expecting a Marko template to be returned from the story: "${composed.id}".`,
      );
      return component.render(input!, cb);
    },
    renderSync(rawInput: Partial<Marko.TemplateInput<Input>> | undefined) {
      const { component, input } = composed(rawInput);
      assertIsTemplate(
        component,
        `Expecting a Marko template to be returned from the story: "${composed.id}".`,
      );
      return component.renderSync(input!);
    },
    renderToString(rawInput: Partial<Marko.TemplateInput<Input>> | undefined) {
      const { component, input } = composed(rawInput);
      assertIsTemplate(
        component,
        `Expecting a Marko template to be returned from the story: "${composed.id}".`,
      );
      return component.renderToString(input!);
    },
    stream(rawInput: Partial<Marko.TemplateInput<Input>> | undefined) {
      const { component, input } = composed(rawInput);
      assertIsTemplate(
        component,
        `Expecting a Marko template to be returned from the story: "${composed.id}".`,
      );
      return component.stream(input!);
    },
  } satisfies Marko.Template<Input>;
}

function assertIsTemplate(
  template: any,
  msg: string,
): asserts template is Marko.Template {
  if (!template || !template.renderSync) {
    throw new Error(msg);
  }
}
