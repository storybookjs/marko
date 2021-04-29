import m from 'mithril';

export type { RenderContext } from '@storybook/core';

export interface IStorybookStory {
  name: string;
  render: () => any;
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}

export type StoryFnMithrilReturnType = m.Component<unknown>;

export interface ShowErrorArgs {
  title: string;
  description: string;
}
