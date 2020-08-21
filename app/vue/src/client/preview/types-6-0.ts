import { Component, AsyncComponent } from 'vue';
import { Args as DefaultArgs, Annotations, BaseMeta, BaseStory } from '@storybook/addons';
import { StoryFnVueReturnType } from './types';

export { Args, ArgTypes, Parameters, StoryContext } from '@storybook/addons';

type VueComponent = Component<any, any, any, any> | AsyncComponent<any, any, any, any>;
type VueReturnType = StoryFnVueReturnType;

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<Args = DefaultArgs> = BaseMeta<VueComponent> & Annotations<Args, VueReturnType>;

/**
 * Story function that represents a component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<Args = DefaultArgs> = BaseStory<Args, VueReturnType> &
  Annotations<Args, VueReturnType>;
