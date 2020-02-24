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

// Metadata about a story that can be set at various levels: global, for a kind, or for a single story.
export interface StoryMetadata {
  parameters: Parameters;
  decorators: DecoratorFunction[];
}

export interface StoreItem extends StoryContext {
  id: string;
  kind: string;
  name: string;
  getDecorated: () => StoryFn;
  getOriginal: () => StoryFn;
  story: string;
  storyFn: StoryFn;
  hooks: HooksContext;
  parameters: Parameters;
}

export interface StoreData {
  [key: string]: StoreItem;
}

export interface ClientApiParams {
  storyStore: StoryStore;
  decorateStory?: (storyFn: any, decorators: any) => any;
  noStoryModuleAddMethodHotDispose?: boolean;
}

export type ClientApiReturnFn<StoryFnReturnType> = (...args: any[]) => StoryApi<StoryFnReturnType>;

export { StoryApi, DecoratorFunction };

export interface AddStoryArgs extends StoryMetadata {
  id: string;
  kind: string;
  name: string;
  storyFn: StoryFn;
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
