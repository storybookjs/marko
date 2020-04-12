import { ArgTypes, ArgType } from '@storybook/addons';
import { Control } from '@storybook/components';
import { SBEnumType } from '../../lib/sbtypes';

const inferControl = (argType: ArgType): Control => {
  if (!argType.type) {
    // console.log('no sbtype', { argType });
    return null;
  }
  switch (argType.type.name) {
    case 'array':
      return { type: 'array' };
    case 'boolean':
      return { type: 'boolean' };
    case 'string':
      return { type: 'text' };
    case 'number':
      return { type: 'number' };
    case 'enum': {
      const { value } = argType.type as SBEnumType;
      return { type: 'options', controlType: 'select', options: value };
    }
    case 'function':
    case 'symbol':
      return null;
    default:
      return { type: 'object' };
  }
};

export const inferControls = (argTypes: ArgTypes) => {
  return Object.entries(argTypes).reduce((acc, [key, argType]) => {
    const control = argType && argType.type && inferControl(argType);
    if (control) {
      acc[key] = { control };
    }
    return acc;
  }, {} as ArgTypes);
};
