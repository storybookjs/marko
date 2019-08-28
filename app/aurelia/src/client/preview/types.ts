import { StoryFn } from '@storybook/addons';

export interface RenderMainArgs {
  storyFn: StoryFn<StoryFnAureliaReturnType>;
  selectedKind: string;
  selectedStory: string;
  showMain: () => void;
  showError: (args: ShowErrorArgs) => void;
  showException: (...args: any[]) => void;
  forceRender: boolean;
}
export interface StoryFnAureliaReturnType {
  template?: string;
}
export interface ShowErrorArgs {
  title: string;
  description: string;
}