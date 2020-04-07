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
    const fieldTypes = Object.keys(value).reduce((acc, key) => {
      acc[key] = inferType(value[key]);
      return acc;
    }, {} as Record<string, SBType>);
    return { name: 'object', value: fieldTypes };
  }
  return { name: 'other', value: 'unknown' };
};

export const inferArgTypes = (args: Args) => {
  if (!args) return {};
  return Object.entries(args).reduce((acc, [name, arg]) => {
    if (arg != null) {
      const type = inferType(arg);
      if (type) {
        acc[name] = { name, type };
      } else {
        throw new Error(`Unknown arg: ${arg}`);
      }
    }
    return acc;
  }, {} as ArgTypes);
};
