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
  globals: {},
};

export const defaultDecorateStory = (storyFn: StoryFn, decorators: DecoratorFunction[]) =>
  decorators.reduce(
    (decorated, decorator) => (context: StoryContext = defaultContext) =>
      decorator(
        // You cannot override the parameters key, it is fixed
        ({ parameters, ...innerContext }: StoryContextUpdate = {}) =>
          decorated({ ...context, ...innerContext }),
        context
      ),
    storyFn
  );
