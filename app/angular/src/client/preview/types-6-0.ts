import {
  Args as DefaultArgs,
  Annotations,
  BaseMeta,
  BaseStory,
  Parameters as DefaultParameters,
  StoryContext as DefaultStoryContext,
} from '@storybook/addons';
import { StoryFnAngularReturnType } from './types';

export { Args, ArgTypes } from '@storybook/addons';

type AngularComponent = any;
type AngularReturnType = StoryFnAngularReturnType;

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<Args = DefaultArgs> = BaseMeta<AngularComponent> &
  Annotations<Args, AngularReturnType>;

/**
 * Story function that represents a component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<Args = DefaultArgs> = BaseStory<Args, AngularReturnType> &
  Annotations<Args, AngularReturnType>;

export type Parameters = DefaultParameters & {
  /** Uses legacy angular rendering engine that use dynamic component */
  angularLegacyRendering?: boolean;
  component: unknown;
};

export type StoryContext = DefaultStoryContext & { parameters: Parameters };
