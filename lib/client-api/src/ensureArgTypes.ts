import mapValues from 'lodash/mapValues';
import { ArgTypesEnhancer } from './types';
import { combineParameters } from './parameters';

export const ensureArgTypes: ArgTypesEnhancer = (context) => {
  const { argTypes: userArgTypes = {}, args = {} } = context.parameters;
  if (!args) return userArgTypes;
  const argTypes = mapValues(args, (_arg, name) => ({ name }));
  return combineParameters(argTypes, userArgTypes);
};
