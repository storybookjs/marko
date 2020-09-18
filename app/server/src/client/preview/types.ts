export { RenderContext } from '@storybook/core';

export type StoryFnServerReturnType = any;

export type FetchStoryHtmlType = (url: string, id: string, params: any) => Promise<string | Node>;

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
