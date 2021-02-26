import { AnyComponent } from 'preact';
import { Args as DefaultArgs, Annotations, BaseMeta, BaseStory } from '@storybook/addons';
import { StoryFnPreactReturnType } from './types';

export { Args, ArgTypes, Parameters, StoryContext } from '@storybook/addons';

type PreactComponent = AnyComponent<any, any>;
type PreactReturnType = StoryFnPreactReturnType;

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<Args = DefaultArgs> = BaseMeta<PreactComponent> &
  Annotations<Args, PreactReturnType>;

/**
 * Story function that represents a component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<Args = DefaultArgs> = BaseStory<Args, PreactReturnType> &
  Annotations<Args, PreactReturnType>;
