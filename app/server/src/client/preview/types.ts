import { StoryFn } from '@storybook/addons';

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

export interface ConfigureOptionsArgs {
  fetchStoryHtml: FetchStoryHtmlType;
}

export interface RenderMainArgs {
  storyFn: () => StoryFn<StoryFnServerReturnType>;
  id: string;
  selectedKind: string;
  selectedStory: string;
  showMain: () => void;
  showError: (args: ShowErrorArgs) => void;
  forceRender: boolean;
  parameters: any;
}
