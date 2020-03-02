import { ParameterEnhancer, combineParameters } from '@storybook/client-api';
import { Toolbars } from '../types';

export const parameterEnhancers: ParameterEnhancer[] = [
  context => {
    const { toolbars, globalArgs = {} } = context.parameters;

    const toolbarArgs = Object.keys(toolbars).reduce((acc, key) => {
      acc[key] = toolbars[key].defaultValue;
      return acc;
    }, {} as Toolbars);

    return { globalArgs: combineParameters(toolbarArgs, globalArgs) };
  },
];
