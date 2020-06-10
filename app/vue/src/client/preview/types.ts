import { Component } from 'vue';
import { Args } from '@storybook/addons';

export { RenderContext } from '@storybook/core';

export interface ShowErrorArgs {
  title: string;
  description: string;
}

// TODO: some vue expert needs to look at this
export type StoryFnVueReturnType = string | (Component & { args?: Args });

export interface IStorybookStory {
  name: string;
  render: () => any;
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}
