import { ConcreteComponent } from 'vue';
import { Args as DefaultArgs, Annotations, BaseMeta, BaseStory } from '@storybook/addons';
import { StoryFnVueReturnType } from './types';

export type { Args, ArgTypes, Parameters, StoryContext } from '@storybook/addons';

type VueComponent = ConcreteComponent<any>;
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

export type Decorators = Story['decorators'];
