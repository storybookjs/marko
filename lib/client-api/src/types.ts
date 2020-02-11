import {
  Addon,
  StoryFn,
  StoryContext,
  Parameters,
  StoryApi,
  DecoratorFunction,
} from '@storybook/addons';
import StoryStore from './story_store';
import { HooksContext } from './hooks';

export interface ErrorLike {
  message: string;
  stack: string;
}

export interface StoreItem extends StoryContext {
  getDecorated: () => StoryFn;
  getOriginal: () => StoryFn;
  story: string;
  storyFn: StoryFn;
  hooks: HooksContext;
}

export interface StoreData {
  [key: string]: StoreItem;
}

export interface ClientApiParams {
  storyStore: StoryStore;
  decorateStory?: (storyFn: any, decorators: any) => any;
}

export type ClientApiReturnFn<StoryFnReturnType> = (...args: any[]) => StoryApi<StoryFnReturnType>;

export { StoryApi, DecoratorFunction };

export interface AddStoryArgs {
  id: string;
  kind: string;
  name: string;
  storyFn: StoryFn;
  parameters: Parameters;
}

export interface ClientApiAddon<StoryFnReturnType = unknown> extends Addon {
  apply: (a: StoryApi<StoryFnReturnType>, b: any[]) => any;
}

export interface ClientApiAddons<StoryFnReturnType> {
  [key: string]: ClientApiAddon<StoryFnReturnType>;
}

export interface GetStorybookStory {
  name: string;
  render: StoryFn;
}

export interface GetStorybookKind {
  kind: string;
  fileName: string;
  stories: GetStorybookStory[];
}
