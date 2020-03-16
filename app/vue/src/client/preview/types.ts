import { Component } from 'vue';

export { RenderContext } from '@storybook/core';

export interface ShowErrorArgs {
  title: string;
  description: string;
}

// TODO: some vue expert needs to look at this
export type StoryFnVueReturnType = string | Component;

export interface IStorybookStory {
  name: string;
  render: () => any;
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}
