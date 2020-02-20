import {
  StoryId,
  StoryKind,
  StoryName,
  StoryFn,
  StoryContext,
  Channel,
  Parameters,
  DecoratorFunction,
  HooksContext,
} from '@storybook/addons';
import { StoreItem } from '@storybook/client-api';

export interface PreviewError {
  message?: string;
  stack?: string;
}

// Copy of require.context
// interface RequireContext {
//   keys(): string[];
//   (id: string): any;
//   <T>(id: string): T;
//   resolve(id: string): string;
//   /** The module id of the context module. This may be useful for module.hot.accept. */
//   id: string;
// }

export type RequireContext = {
  keys: () => string[];
  (id: string): any;
  resolve(id: string): string;
};
export type LoaderFunction = () => void | any[];
export type Loadable = RequireContext | RequireContext[] | LoaderFunction;

// Previously this also included these fields but I don't think they were used:
//   { configApi, storyStore, channel, clientApi, };
export interface RenderContext extends StoreItem {
  id: StoryId;
  kind: StoryKind;
  name: StoryName;
  parameters: Parameters;
  getDecorated: () => StoryFn;
  getOriginal: () => StoryFn;
  hooks: HooksContext;

  // Legacy identifiers that are already on StoreItem (as name/kind) but widely used
  selectedKind: StoryKind;
  selectedStory: StoryName;
  forceRender: boolean;

  showMain: () => void;
  showError: (error: { title: string; description: string }) => void;
  showException: (err: Error) => void;
}

// The function used by a framework to render story to the DOM
export type RenderStoryFunction = (context: RenderContext) => void;
