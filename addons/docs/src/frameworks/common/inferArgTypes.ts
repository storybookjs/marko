import mapValues from 'lodash/mapValues';
import { Args, ArgTypes } from '@storybook/addons';
import { SBType } from '../../lib/sbtypes';

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
    return { name: 'array', value: [childType] };
  }
  if (value) {
    const fieldTypes = mapValues(value, (field) => inferType(field));
    return { name: 'object', value: fieldTypes };
  }
  return { name: 'other', value: 'unknown' };
};

export const inferArgTypes = (args: Args): ArgTypes => {
  if (!args) return {};
  return mapValues(args, (arg, name) => {
    if (arg !== null && typeof arg !== 'undefined') {
      return { name, type: inferType(arg) };
    }
    return undefined;
  });
};
