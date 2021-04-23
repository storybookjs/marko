import { StoryContext, StoryContextUpdate, PartialStoryFn, LegacyStoryFn } from '@storybook/addons';
import { DecoratorFunction } from './types';

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
  ({ parameters, ...innerContext }: StoryContextUpdate = {}) =>
    storyFn({ ...getStoryContext(), ...innerContext });

export const decorateStory = (
  storyFn: LegacyStoryFn,
  decorator: DecoratorFunction,
  getStoryContext: () => StoryContext
): LegacyStoryFn => {
  // Bind the partially decorated storyFn so that when it is called it always knows about the story context,
  // no matter what it is passed directly. This is because we cannot guarantee a decorator will
  // pass the context down to the next decorator in the chain.
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
  // This will break if you call the same story twice interleaved.
  let contextStore: StoryContext;
  const decoratedWithContextStore = decorators.reduce(
    (story, decorator) => decorateStory(story, decorator, () => contextStore),
    storyFn
  );
  return (context) => {
    contextStore = context;
    return decoratedWithContextStore(context);
  };
};
