import { ParameterEnhancer, combineParameters } from '@storybook/client-api';
import { Toolbars } from '../types';

export const parameterEnhancers: ParameterEnhancer[] = [
  context => {
    const { toolbars, globalArgs: inputArgs = {} } = context.parameters;

    const toolbarArgs = Object.keys(toolbars).reduce((acc, key) => {
      acc[key] = toolbars[key].defaultValue;
      return acc;
    }, {} as Toolbars);

    const globalArgs = {
      ...inputArgs,
      toolbars: combineParameters(toolbarArgs, inputArgs.toolbars),
    };

    return { globalArgs };
  },
];
