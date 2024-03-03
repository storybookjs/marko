import type {
  AnnotatedStoryFn,
  Args,
  ComponentAnnotations,
  DecoratorFunction,
  StoryContext as GenericStoryContext,
  LoaderFunction,
  ProjectAnnotations,
  StoryAnnotations,
} from "@storybook/types";

import type { MarkoRenderer } from "./types";

export type { Args, ArgTypes, Parameters, StrictArgs } from "@storybook/types";

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<Input extends Args = Args> = ComponentAnnotations<
  MarkoRenderer,
  Input
>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<Input extends Args = Args> = AnnotatedStoryFn<
  MarkoRenderer<Input>,
  Input
>;

/**
 * Story function that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<Input extends Args = Args> = StoryAnnotations<
  MarkoRenderer<Input>,
  Input
>;

/**
 * A Story function that represents either a CSFv2 or a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<Input extends Args = Args> = StoryFn<Input> | StoryObj<Input>;

export type { MarkoRenderer };
export type Decorator<Input extends Args = Args> = DecoratorFunction<
  MarkoRenderer,
  Input
>;
export type Loader<Input extends Args = Args> = LoaderFunction<
  MarkoRenderer,
  Input
>;
export type StoryContext<Input extends Args = Args> = GenericStoryContext<
  MarkoRenderer,
  Input
>;
export type Preview = ProjectAnnotations<MarkoRenderer>;
