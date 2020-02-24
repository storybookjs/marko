// Based on http://backbonejs.org/docs/backbone.html#section-164
import { document, Element } from 'global';
import { useEffect } from '@storybook/client-api';

import { makeDecorator } from '@storybook/addons';
import { actions } from './actions';

import { PARAM_KEY } from '../constants';

const delegateEventSplitter = /^(\S+)\s*(.*)$/;

const isIE = Element != null && !Element.prototype.matches;
const matchesMethod = isIE ? 'msMatchesSelector' : 'matches';

const root = document && document.getElementById('root');

const hasMatchInAncestry = (element: any, selector: any): boolean => {
  if (element[matchesMethod](selector)) {
    return true;
  }
  const parent = element.parentElement;
  if (!parent) {
    return false;
  }
  return hasMatchInAncestry(parent, selector);
};

const createHandlers = (actionsFn: (...arg: any[]) => object, ...args: any[]) => {
  const actionsObject = actionsFn(...args);
  return Object.entries(actionsObject).map(([key, action]) => {
    const [_, eventName, selector] = key.match(delegateEventSplitter);
    return {
      eventName,
      handler: (e: { target: any }) => {
        if (!selector || hasMatchInAncestry(e.target, selector)) {
          action(e);
        }
      },
    };
  });
};

const applyEventHandlers = (actionsFn: any, ...args: any[]) => {
  useEffect(() => {
    if (root != null) {
      const handlers = createHandlers(actionsFn, ...args);
      handlers.forEach(({ eventName, handler }) => root.addEventListener(eventName, handler));
      return () =>
        handlers.forEach(({ eventName, handler }) => root.removeEventListener(eventName, handler));
    }
    return undefined;
  }, [root, actionsFn, args]);
};

export const createDecorator = (actionsFn: any) => (...args: any[]) => (storyFn: () => any) => {
  applyEventHandlers(actionsFn, ...args);

  return storyFn();
};

export const withActions = makeDecorator({
  name: 'withActions',
  parameterName: PARAM_KEY,
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: false,
  wrapper: (getStory, context, { parameters }) => {
    // allow a shortcut of providing just an array.
    // Anticipating that we'll soon kill configureActions in favor of configuration via parameters
    const storyOptions = Array.isArray(parameters) ? { handles: parameters } : parameters;
    applyEventHandlers(actions, ...storyOptions.handles);

    return getStory(context);
  },
});
