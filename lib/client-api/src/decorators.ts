import { StoryContext, StoryContextUpdate, PartialStoryFn, LegacyStoryFn } from '@storybook/addons';
import { DecoratorFunction } from './types';

const defaultContext: StoryContext = {
  id: 'unspecified',
  name: 'unspecified',
  kind: 'unspecified',
  parameters: {},
  args: {},
  argTypes: {},
  globals: {},
};

/**
 * When you call the story function inside a decorator, e.g.:
 *
 * ```jsx
 * <div>{storyFn({ foo: 'bar' })}</div>
 * ```
 *
 * This will override the `foo` property on the `innerContext`, which gets
 * merged in with the default context
 */
const bindWithContext = (
  storyFn: LegacyStoryFn,
  getStoryContext: () => StoryContext
): PartialStoryFn =>
  // (NOTE: You cannot override the parameters key, it is fixed)
  ({ id, name, kind, parameters, ...contextUpdate }: StoryContextUpdate = {}) =>
    storyFn({ ...getStoryContext(), ...contextUpdate });

export const decorateStory = (
  storyFn: LegacyStoryFn,
  decorator: DecoratorFunction,
  getStoryContext: () => StoryContext
): LegacyStoryFn => {
  // Bind the partially decorated storyFn so that when it is called it always knows about the story context,
  // no matter what it is passed directly. This is because we cannot guarantee a decorator will
  // pass the context down to the next decorated story in the chain.
  const boundStoryFunction = bindWithContext(storyFn, getStoryContext);

  return (context: StoryContext) => decorator(boundStoryFunction, context);
};

export const defaultDecorateStory = (
  storyFn: LegacyStoryFn,
  decorators: DecoratorFunction[]
): LegacyStoryFn => {
  // We use a trick to avoid recreating the bound story function inside `decorateStory`.
  // Instead we pass it a context "getter", which is defined once (at "decoration time")
  // The getter reads a variable which is scoped to this call of `decorateStory`
  // (ie to this story), so there is no possibility of overlap.
  // This will break if you call the same story twice interleaved
  // (React might do it if you rendered the same story twice in the one ReactDom.render call, for instance)
  let contextStore: StoryContext;
  const decoratedWithContextStore = decorators.reduce(
    (story, decorator) => decorateStory(story, decorator, () => contextStore),
    storyFn
  );
  return (context = defaultContext) => {
    contextStore = context;
    return decoratedWithContextStore(context); // Pass the context directly into the first decorator
  };
};
