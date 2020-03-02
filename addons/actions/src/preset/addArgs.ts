import { ParameterEnhancer, combineParameters } from '@storybook/client-api';
import { Args } from '@storybook/addons';

import { action } from '../index';

// interface ActionsParameter {
//   disable?: boolean;
//   args?: string[];
//   argTypesRegex?: RegExp;
// }

/**
 * Automatically add action args for argTypes whose name
 * matches a regex, such as `^on.*` for react-style `onClick` etc.
 */
export const inferActionsFromArgTypes: ParameterEnhancer = context => {
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
export const addActionsFromArgs: ParameterEnhancer = context => {
  const { args, actions } = context.parameters;
  if (!actions || actions.disable || !actions.args) {
    return null;
  }

  const actionArgs = (actions.args as string[]).reduce((acc, name) => {
    acc[name] = action(name);
    return acc;
  }, {} as Args);

  return {
    args: combineParameters(actionArgs, args),
  };
};

export const parameterEnhancers = [addActionsFromArgs, inferActionsFromArgTypes];
