import { ParameterEnhancer, combineParameters } from '@storybook/client-api';
import { Args, ArgType } from '@storybook/addons';

import { action } from '../index';

// interface ActionsParameter {
//   disable?: boolean;
//   argTypesRegex?: RegExp;
// }

/**
 * Automatically add action args for argTypes whose name
 * matches a regex, such as `^on.*` for react-style `onClick` etc.
 */
export const inferActionsFromArgTypesRegex: ParameterEnhancer = (context) => {
  const { args, actions, argTypes } = context.parameters;
  if (!actions || actions.disable || !actions.argTypesRegex || !argTypes) {
    return null;
  }

  const argTypesRegex = new RegExp(actions.argTypesRegex);
  const actionArgs = Object.keys(argTypes).reduce((acc, name) => {
    if (argTypesRegex.test(name)) {
      acc[name] = action(name);
    }
    return acc;
  }, {} as Args);

  return {
    args: combineParameters(actionArgs, args),
  };
};

/**
 * Add action args for list of strings.
 */
export const addActionsFromArgTypes: ParameterEnhancer = (context) => {
  const { args, argTypes, actions } = context.parameters;
  if (actions?.disable || !argTypes) {
    return null;
  }

  const actionArgs = Object.keys(argTypes).reduce((acc, argName) => {
    const argType: ArgType = argTypes[argName];
    if (argType.action) {
      const message = typeof argType.action === 'string' ? argType.action : argName;
      acc[argName] = action(message);
    }
    return acc;
  }, {} as Args);

  return {
    args: combineParameters(actionArgs, args),
  };
};

export const parameterEnhancers = [addActionsFromArgTypes, inferActionsFromArgTypesRegex];
