// eslint-disable-next-line import/no-extraneous-dependencies
import { TemplateResult, SVGTemplateResult } from 'lit-element';

export type { RenderContext } from '@storybook/core';
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
