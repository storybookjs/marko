import { ReactElement } from 'react';
import type { StorybookConfig as BaseConfig } from '@storybook/core/types';

// eslint-disable-next-line import/no-extraneous-dependencies
export { RenderContext } from '@storybook/client-api';

export interface StorybookConfig extends BaseConfig {
  reactOptions?: {
    fastRefresh?: boolean;
  };
}

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
