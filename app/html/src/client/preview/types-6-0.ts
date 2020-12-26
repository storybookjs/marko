import { Args as DefaultArgs, Annotations, BaseMeta, BaseStory } from '@storybook/addons';
import { StoryFnHtmlReturnType } from './types';

export type { Args, ArgTypes, Parameters, StoryContext } from '@storybook/addons';

type HTMLReturnType = StoryFnHtmlReturnType;

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<Args = DefaultArgs> = BaseMeta<HTMLElement> & Annotations<Args, HTMLReturnType>;

/**
 * Story function that represents a component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<Args = DefaultArgs> = BaseStory<Args, HTMLReturnType> &
  Annotations<Args, HTMLReturnType>;
