import deprecate from 'util-deprecate';
import dedent from 'ts-dedent';

import { DecoratorFunction } from '../models';

export const decorateAction = (_decorators: DecoratorFunction[]) => {
  return deprecate(
    () => {},
    dedent`
    decorateAction is no longer supported as of Storybook 6.0.
  `
  );
};

export const decorate = (_decorators: DecoratorFunction[]) => {
  return deprecate(
    () => {
      return {
        action: deprecate(() => {}, 'decorate.action is no longer supported as of Storybook 6.0.'),
        actions: deprecate(() => {},
        'decorate.actions is no longer supported as of Storybook 6.0.'),
        withActions: deprecate(() => {},
        'decorate.withActions is no longer supported as of Storybook 6.0.'),
      };
    },
    dedent`
    decorate is deprecated, please configure addon-actions using the addParameter api:
      
      addParameters({
        actions: {
          handles: options
        },
      });
    `
  );
};
