import type {
  Args as DefaultArgs,
  Annotations,
  BaseMeta,
  BaseStoryFn,
  BaseStoryObject,
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

export type StoryFnMarkoReturnType<Args = Record<string, any>> = {
  component?: any;
  input?: Args;
};

export type StoryFn<Args = DefaultArgs> = BaseStoryFn<
  Args,
  StoryFnMarkoReturnType<Args>
> &
  Annotations<Args, StoryFnMarkoReturnType<Args>>;

export type StoryObj<Args = DefaultArgs> = BaseStoryObject<
  Args,
  StoryFnMarkoReturnType<Args>
> &
  Annotations<Args, StoryFnMarkoReturnType<Args>>;

export type Story<Args = DefaultArgs> = StoryFn<Args> | StoryObj<Args>;
