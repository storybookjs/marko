import { Component, FunctionComponent } from 'react';
import {
  Args as DefaultArgs,
  ArgTypes,
  Parameters,
  DecoratorFunction,
  StoryContext,
} from '@storybook/addons';
import { StoryFnReactReturnType } from './types';

// Base types
interface Annotations<Args, StoryFnReturnType> {
  /**
   * Dynamic data that are provided (and possibly updated by) Storybook and its addons.
   * @see [Arg story inputs](https://github.com/storybookjs/storybook/blob/next/docs/src/pages/formats/component-story-format/index.md#args-story-inputs)
   */
  args?: Partial<Args>;
  /**
   * ArgTypes encode basic metadata for args, such as `name`, `description`, `defaultValue` for an arg. These get automatically filled in by Storybook Docs.
   * @see [Control annotations](https://github.com/storybookjs/storybook/blob/91e9dee33faa8eff0b342a366845de7100415367/addons/controls/README.md#control-annotations)
   */
  argTypes?: ArgTypes;
  /**
   * Wrapper components or Storybook decorators that wrap a story.
   * @see [Parameters](https://storybook.js.org/docs/basics/writing-stories/#parameters)
   */
  parameters?: Parameters;
  /**
   * Wrapper components or Storybook decorators that wrap a story.
   *
   * Decorators defined in Meta will be applied to every story variation.
   * @see [Decorators](https://storybook.js.org/docs/addons/introduction/#1-decorators)
   */
  decorators?: DecoratorFunction<StoryFnReturnType>[];
  /**
   * Used to only include certain named exports as stories. Useful when you want to have non-story exports such as mock data or ignore a few stories.
   * @example
   * includeStories: ['SimpleStory', 'ComplexStory']
   * includeStories: /.*Story$/
   *
   * @see [Non-story exports](https://storybook.js.org/docs/formats/component-story-format/#non-story-exports)
   */
  includeStories?: string[] | RegExp;
  /**
   * Used to exclude certain named exports. Useful when you want to have non-story exports such as mock data or ignore a few stories.
   * @example
   * excludeStories: ['simpleData', 'complexData']
   * excludeStories: /.*Data$/
   *
   * @see [Non-story exports](https://storybook.js.org/docs/formats/component-story-format/#non-story-exports)
   */
  excludeStories?: string[] | RegExp;
}

interface BaseMeta<ComponentType> {
  /**
   * Title of the story which will be presented in the navigation. **Should be unique.**
   *
   * Stories can be organized in a nested structure using "/" as a separator.
   *
   * @example
   * export default {
   *   ...
   *   title: 'Design System/Atoms/Button'
   * }
   *
   * @see [Story Hierarchy](https://storybook.js.org/docs/basics/writing-stories/#story-hierarchy)
   */
  title: string;
  /**
   * Reference of the component for your story.
   *
   * Used by addons for automatic prop table generation and display of other component metadata.
   */
  component?: ComponentType;
  /**
   * Subcomponents that are part of the stories.
   *
   * @example
   * import { Button, ButtonGroup } from './components';
   *
   * export default {
   *   ...
   *   subcomponents: { Button, ButtonGroup }
   * }
   *
   * By defining them each component will have its tab in the args table.
   */
  subcomponents?: Record<string, ComponentType>;
}

interface BaseStory<Args, StoryFnReturnType> {
  (args: Args, context: StoryContext): StoryFnReturnType;
  storyName?: string;
}

// Re-export generic types
export { DefaultArgs as Args, ArgTypes, Parameters, StoryContext };

// React specific types
type ReactComponent = Component | FunctionComponent<any>;
type ReactReturnType = StoryFnReactReturnType;

/**
 * Wrapper components or Storybook decorators that wrap a story.
 *
 * Decorators can be applied globally, at the component level, or individually at the story level. Global decorators are typically applied in the Storybook config files, and component/story decorators are applied in the story file.
 *
 * @see [Decorators](https://storybook.js.org/docs/basics/writing-stories/#decorators)
 */
export type Decorator = DecoratorFunction<ReactReturnType>;

/**
 * Represents the configuration applied for all variations of a story.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<Args = DefaultArgs> = BaseMeta<ReactComponent> &
  Annotations<Args, ReactReturnType>;

/**
 * Story function that represents a variation of your component.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<Args = DefaultArgs> = BaseStory<Args, ReactReturnType> &
  Annotations<Args, ReactReturnType>;
