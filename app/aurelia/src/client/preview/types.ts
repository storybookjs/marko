import { StoryFn } from '@storybook/addons';
import { IRegistry, IContainer } from '@aurelia/kernel';
import { Component } from './decorators';

export interface RenderMainArgs {
  storyFn: StoryFn<Partial<StoryFnAureliaReturnType>>;
  selectedKind: string;
  selectedStory: string;
  showMain: () => void;
  showError: (args: ShowErrorArgs) => void;
  showException: (...args: any[]) => void;
  forceRender: boolean;
}
export type StoryFnAureliaReturnType = {
  customElement: any;
  components: Component[] | unknown[];
  template: unknown;
  items: IRegistry[];
  container: IContainer;

}
export interface ShowErrorArgs {
  title: string;
  description: string;
}

export interface IStorybookStory {
  name: string;
  render: () => any;
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}
