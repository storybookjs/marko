import { StoryContext, StoryFn, Parameters } from '@storybook/addons';
import { ClientApiParams, DecoratorFunction, ClientApiAddons, StoryApi } from './types';

const defaultContext: StoryContext = {
  id: 'unspecified',
  name: 'unspecified',
  kind: 'unspecified',
  parameters: {},
};

export const defaultDecorateStory = (storyFn: StoryFn, decorators: DecoratorFunction[]) =>
  decorators.reduce(
    (decorated, decorator) => (context: StoryContext = defaultContext) =>
      decorator(
        // You cannot override the parameters key, it is fixed
        ({ parameters, ...innerContext }: StoryContext) =>
          decorated(
            innerContext
              ? {
                  ...context,
                  ...innerContext,
                }
              : context
          ),
        context
      ),
    storyFn
  );
