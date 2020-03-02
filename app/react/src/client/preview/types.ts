import { ReactElement } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
export { RenderContext } from '@storybook/client-api';

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export type StoryFnReactReturnType = ReactElement<unknown>;

export interface IStorybookStory {
  name: string;
  render: () => any;
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}
