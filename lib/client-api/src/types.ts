import {
  Addon,
  StoryId,
  StoryName,
  StoryKind,
  ViewMode,
  StoryIdentifier,
  StoryFn,
  Parameters,
  Args,
  ArgTypes,
  StoryApi,
  DecoratorFunction,
  DecorateStoryFunction,
  StoryContext,
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
export type ArgTypesEnhancer = (context: StoryContext) => ArgTypes;

type StorySpecifier = StoryId | { name: StoryName; kind: StoryKind } | '*';

export interface StoreSelectionSpecifier {
  storySpecifier: StorySpecifier;
  viewMode: ViewMode;
}

export interface StoreSelection {
  storyId: StoryId;
  viewMode: ViewMode;
}

export type AddStoryArgs = StoryIdentifier & {
  storyFn: StoryFn<any>;
  parameters?: Parameters;
  decorators?: DecoratorFunction[];
};

export type StoreItem = StoryIdentifier & {
  parameters: Parameters;
  getDecorated: () => StoryFn<any>;
  getOriginal: () => StoryFn<any>;
  storyFn: StoryFn<any>;
  hooks: HooksContext;
  args: Args;
};

export type PublishedStoreItem = StoreItem & {
  globals: Args;
};

export interface StoreData {
  [key: string]: StoreItem;
}

export interface ClientApiParams {
  storyStore: StoryStore;
  decorateStory?: DecorateStoryFunction;
  noStoryModuleAddMethodHotDispose?: boolean;
}

export type ClientApiReturnFn<StoryFnReturnType> = (...args: any[]) => StoryApi<StoryFnReturnType>;

export { StoryApi, DecoratorFunction };

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

// This really belongs in lib/core, but that depends on lib/ui which (dev) depends on app/react
// which needs this type. So we put it here to avoid the circular dependency problem.
export type RenderContext = StoreItem & {
  forceRender: boolean;

  showMain: () => void;
  showError: (error: { title: string; description: string }) => void;
  showException: (err: Error) => void;
};
