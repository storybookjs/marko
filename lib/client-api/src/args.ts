import { Args, ArgTypes } from '@storybook/addons';

type ValueType = { name: string; value?: ObjectValueType | ValueType };
type ObjectValueType = Record<string, ValueType>;

const map = (arg: any, type: ValueType): any => {
  switch (type?.name) {
    case 'string':
      return String(arg);
    case 'number':
      return Number(arg);
    case 'boolean':
      return arg === 'true';
    case 'array':
      if (!type.value || !Array.isArray(arg)) return undefined;
      return arg.reduce((acc, item) => {
        const mapped = map(item, type.value as ValueType);
        return mapped === undefined ? acc : acc.concat([mapped]);
      }, []);
    case 'object':
      if (!type.value || typeof arg !== 'object') return undefined;
      return Object.entries(arg).reduce((acc, [key, val]) => {
        const mapped = map(val, (type.value as ObjectValueType)[key]);
        return mapped === undefined ? acc : Object.assign(acc, { [key]: mapped });
      }, {} as Args);
    default:
      return undefined;
  }
};

export const mapArgsToTypes = (args: Args, argTypes: ArgTypes): Args => {
  return Object.entries(args).reduce((acc, [key, value]) => {
    return Object.assign(acc, { [key]: map(value, argTypes[key]?.type) });
  }, {});
};
