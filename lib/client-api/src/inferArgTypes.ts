import mapValues from 'lodash/mapValues';
import { SBType, ArgTypesEnhancer } from './types';
import { combineParameters } from './parameters';

const inferType = (value?: any): SBType => {
  const type = typeof value;
  switch (type) {
    case 'boolean':
    case 'string':
    case 'number':
    case 'function':
      return { name: type };
    default:
      break;
  }
  if (Array.isArray(value)) {
    const childType: SBType =
      value.length > 0 ? inferType(value[0]) : { name: 'other', value: 'unknown' };
    return { name: 'array', value: childType };
  }
  if (value) {
    const fieldTypes = mapValues(value, (field) => inferType(field));
    return { name: 'object', value: fieldTypes };
  }
  return { name: 'other', value: 'unknown' };
};

export const inferArgTypes: ArgTypesEnhancer = (context) => {
  const { argTypes: userArgTypes = {}, args = {} } = context.parameters;
  if (!args) return userArgTypes;
  const argTypes = mapValues(args, (arg) => {
    if (arg !== null && typeof arg !== 'undefined') {
      return { type: inferType(arg) };
    }
    return undefined;
  });
  return combineParameters(argTypes, userArgTypes);
};
