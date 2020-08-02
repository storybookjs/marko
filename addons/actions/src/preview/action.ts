import { v4 as uuidv4 } from 'uuid';
import { addons } from '@storybook/addons';
import { EVENT_ID } from '../constants';
import { ActionDisplay, ActionOptions, HandlerFunction } from '../models';
import { config } from './configureActions';

export function action(name: string, options: ActionOptions = {}): HandlerFunction {
  const actionOptions = {
    ...config,
    ...options,
  };

  const handler = function actionHandler(...args: any[]) {
    const channel = addons.getChannel();
    const id = uuidv4();
    const minDepth = 5; // anything less is really just storybook internals

    const actionDisplayToEmit: ActionDisplay = {
      id,
      count: 0,
      data: { name, args },
      options: {
        ...actionOptions,
        depth: minDepth + (actionOptions.depth || 3),
        allowFunction: actionOptions.allowFunction || false,
      },
    };
    channel.emit(EVENT_ID, actionDisplayToEmit);
  };

  return handler;
}
