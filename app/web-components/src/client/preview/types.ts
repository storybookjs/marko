// eslint-disable-next-line import/no-extraneous-dependencies
import { TemplateResult, SVGTemplateResult } from 'lit-element';
import { Args as DefaultArgs, Annotations, BaseMeta, BaseStory } from '@storybook/addons';

export { RenderContext } from '@storybook/core';
export { Args, ArgTypes, Parameters, StoryContext } from '@storybook/addons';

export type StoryFnHtmlReturnType = string | Node | TemplateResult | SVGTemplateResult;

export interface IStorybookStory {
  name: string;
  render: () => any;
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}

export interface ShowErrorArgs {
  title: string;
  description: string;
}

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<Args = DefaultArgs> = BaseMeta<string> & Annotations<Args, StoryFnHtmlReturnType>;

/**
 * Story function that represents a component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<Args = DefaultArgs> = BaseStory<Args, StoryFnHtmlReturnType> &
  Annotations<Args, StoryFnHtmlReturnType>;
