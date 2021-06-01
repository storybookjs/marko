import type {
  Args as DefaultArgs,
  Annotations,
  BaseMeta,
  BaseStory,
} from "@storybook/addons";

export type {
  Args,
  ArgTypes,
  Parameters,
  StoryContext,
} from "@storybook/addons";

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<Args = DefaultArgs> = BaseMeta<any> &
  Annotations<Args, StoryFnMarkoReturnType<Args>>;

/**
 * Story function that represents a component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<Args = DefaultArgs> = BaseStory<
  Args,
  StoryFnMarkoReturnType<Args>
> &
  Annotations<Args, StoryFnMarkoReturnType<Args>>;

export type StoryFnMarkoReturnType<Args = Record<string, any>> = {
  component?: any;
  input?: Args;
};
