import { StoryContext, StoryFn } from '@storybook/addons';
import { DecoratorFunction } from './types';

interface StoryContextUpdate {
  [key: string]: any;
}

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
export const decorateStory = (storyFn: StoryFn, decorator: DecoratorFunction) => {
  return (context: StoryContext = defaultContext) =>
    decorator(
      // You cannot override the parameters key, it is fixed
      ({ parameters, ...innerContext }: StoryContextUpdate = {}) =>
        storyFn({ ...context, ...innerContext }),
      context
    );
};

export const defaultDecorateStory = (storyFn: StoryFn, decorators: DecoratorFunction[]) =>
  decorators.reduce(decorateStory, storyFn);
