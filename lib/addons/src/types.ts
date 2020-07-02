import { HooksContext } from './hooks';
import { Addon } from './index';

export enum types {
  TAB = 'tab',
  PANEL = 'panel',
  TOOL = 'tool',
  TOOLEXTRA = 'toolextra',
  PREVIEW = 'preview',
  NOTES_ELEMENT = 'notes-element',
}

export type Types = types | string;

export function isSupportedType(type: Types): boolean {
  return !!Object.values(types).find((typeVal) => typeVal === type);
}

export type StoryId = string;
export type StoryKind = string;
export type StoryName = string;
export type ViewMode = 'story' | 'docs';

export interface Parameters {
  fileName?: string;
  options?: OptionsParameter;
  layout?: 'centered' | 'fullscreen' | 'padded';
  docsOnly?: boolean;
  [key: string]: any;
}

// This is duplicated in @storybook/api because there is no common place to put types (manager/preview)
// We cannot import from @storybook/api here because it will lead to manager code (i.e. emotion) imported in the preview
export interface Args {
  [key: string]: any;
}

export interface ArgType {
  name?: string;
  description?: string;
  defaultValue?: any;
  [key: string]: any;
}

export interface ArgTypes {
  [key: string]: ArgType;
}

export interface StoryIdentifier {
  id: StoryId;
  kind: StoryKind;
  name: StoryName;
}

export type StoryContext = StoryIdentifier & {
  [key: string]: any;
  parameters: Parameters;
  args: Args;
  globals: Args;
  hooks?: HooksContext;
};

export interface WrapperSettings {
  options: OptionsParameter;
  parameters: {
    [key: string]: any;
  };
}

export type Comparator<T> = ((a: T, b: T) => boolean) | ((a: T, b: T) => number);
export type StorySortMethod = 'configure' | 'alphabetical';
export interface StorySortObjectParameter {
  method?: StorySortMethod;
  order?: any[];
  locales?: string;
}
export type StorySortParameter = Comparator<any> | StorySortObjectParameter;

export interface OptionsParameter extends Object {
  storySort?: StorySortParameter;
  theme?: {
    base: string;
    brandTitle?: string;
  };
  [key: string]: any;
}

export type StoryGetter = (context: StoryContext) => any;

export type LegacyStoryFn<ReturnType = unknown> = (p?: StoryContext) => ReturnType;
export type ArgsStoryFn<ReturnType = unknown> = (a?: Args, p?: StoryContext) => ReturnType;
export type StoryFn<ReturnType = unknown> = LegacyStoryFn<ReturnType> | ArgsStoryFn<ReturnType>;

export type StoryWrapper = (
  getStory: StoryGetter,
  context: StoryContext,
  settings: WrapperSettings
) => any;

export type MakeDecoratorResult = (...args: any) => any;

export interface AddStoryArgs<StoryFnReturnType = unknown> {
  id: StoryId;
  kind: StoryKind;
  name: StoryName;
  storyFn: StoryFn<StoryFnReturnType>;
  parameters: Parameters;
}

export interface ClientApiAddon<StoryFnReturnType = unknown> extends Addon {
  apply: (a: StoryApi<StoryFnReturnType>, b: any[]) => any;
}
export interface ClientApiAddons<StoryFnReturnType> {
  [key: string]: ClientApiAddon<StoryFnReturnType>;
}

export type ClientApiReturnFn<StoryFnReturnType> = (...args: any[]) => StoryApi<StoryFnReturnType>;

export interface StoryApi<StoryFnReturnType = unknown> {
  kind: StoryKind;
  add: (
    storyName: StoryName,
    storyFn: StoryFn<StoryFnReturnType>,
    parameters?: Parameters
  ) => StoryApi<StoryFnReturnType>;
  addDecorator: (decorator: DecoratorFunction<StoryFnReturnType>) => StoryApi<StoryFnReturnType>;
  addParameters: (parameters: Parameters) => StoryApi<StoryFnReturnType>;
  [k: string]: string | ClientApiReturnFn<StoryFnReturnType>;
}

export type DecoratorFunction<StoryFnReturnType = unknown> = (
  fn: StoryFn<StoryFnReturnType>,
  c: StoryContext
) => ReturnType<StoryFn<StoryFnReturnType>>;

export type DecorateStoryFunction<StoryFnReturnType = unknown> = (
  storyFn: StoryFn<StoryFnReturnType>,
  decorators: DecoratorFunction<StoryFnReturnType>[]
) => StoryFn<StoryFnReturnType>;

export interface ClientStoryApi<StoryFnReturnType = unknown> {
  storiesOf(kind: StoryKind, module: NodeModule): StoryApi<StoryFnReturnType>;
  addDecorator(decorator: DecoratorFunction<StoryFnReturnType>): StoryApi<StoryFnReturnType>;
  addParameters(parameter: Parameters): StoryApi<StoryFnReturnType>;
}

type LoadFn = () => any;
type RequireContext = any; // FIXME
export type Loadable = RequireContext | [RequireContext] | LoadFn;
