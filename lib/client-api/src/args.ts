import { Args, ArgTypes } from '@storybook/addons';
import { isPlainObject } from 'lodash';

type ValueType = { name: string; value?: ObjectValueType | ValueType };
type ObjectValueType = Record<string, ValueType>;

const INCOMPATIBLE = Symbol('incompatible');
const map = (arg: unknown, type: ValueType): any => {
  if (arg === undefined || arg === null) return arg;
  switch (type?.name) {
    case 'string':
      return String(arg);
    case 'number':
      return Number(arg);
    case 'boolean':
      return arg === 'true';
    case 'array':
      if (!type.value || !Array.isArray(arg)) return INCOMPATIBLE;
      return arg.reduce((acc, item) => {
        const mapped = map(item, type.value as ValueType);
        return mapped === INCOMPATIBLE ? acc : acc.concat([mapped]);
      }, []);
    case 'object':
      if (!type.value || typeof arg !== 'object') return INCOMPATIBLE;
      return Object.entries(arg).reduce((acc, [key, val]) => {
        const mapped = map(val, (type.value as ObjectValueType)[key]);
        return mapped === INCOMPATIBLE ? acc : Object.assign(acc, { [key]: mapped });
      }, {} as Args);
    default:
      return INCOMPATIBLE;
  }
};

export const mapArgsToTypes = (args: Args, argTypes: ArgTypes): Args => {
  return Object.entries(args).reduce((acc, [key, value]) => {
    const mapped = map(value, argTypes[key]?.type);
    return mapped === INCOMPATIBLE ? acc : Object.assign(acc, { [key]: mapped });
  }, {});
};

export const combineArgs = (value: any, update: any): Args => {
  if (!isPlainObject(value) || !isPlainObject(update)) return update;
  return Object.keys({ ...value, ...update }).reduce((acc, key) => {
    if (key in update) {
      const combined = combineArgs(value[key], update[key]);
      if (combined !== undefined) acc[key] = combined;
    } else {
      acc[key] = value[key];
    }
    return acc;
  }, {} as any);
};
