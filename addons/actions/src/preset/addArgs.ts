import { ArgTypesEnhancer, combineParameters } from '@storybook/client-api';
import { ArgTypes, ArgType } from '@storybook/addons';

import { action } from '../index';

// interface ActionsParameter {
//   disable?: boolean;
//   argTypesRegex?: RegExp;
// }

/**
 * Automatically add action args for argTypes whose name
 * matches a regex, such as `^on.*` for react-style `onClick` etc.
 */
export const inferActionsFromArgTypesRegex: ArgTypesEnhancer = (context) => {
  const { actions, argTypes } = context.parameters;
  if (!actions || actions.disable || !actions.argTypesRegex || !argTypes) {
    return argTypes;
  }

  const argTypesRegex = new RegExp(actions.argTypesRegex);
  const actionArgTypes = Object.keys(argTypes).reduce((acc, name) => {
    if (argTypesRegex.test(name)) {
      acc[name] = { defaultValue: action(name) };
    }
    return acc;
  }, {} as ArgTypes);

  return combineParameters(actionArgTypes, argTypes) as ArgTypes;
};

/**
 * Add action args for list of strings.
 */
export const addActionsFromArgTypes: ArgTypesEnhancer = (context) => {
  const { argTypes, actions } = context.parameters;
  if (actions?.disable || !argTypes) {
    return argTypes;
  }

  const actionArgTypes = Object.keys(argTypes).reduce((acc, argName) => {
    const argType: ArgType = argTypes[argName];
    if (argType.action) {
      const message = typeof argType.action === 'string' ? argType.action : argName;
      acc[argName] = { defaultValue: action(message) };
    }
    return acc;
  }, {} as ArgTypes);

  return combineParameters(actionArgTypes, argTypes) as ArgTypes;
};

export const argTypesEnhancers = [addActionsFromArgTypes, inferActionsFromArgTypesRegex];
