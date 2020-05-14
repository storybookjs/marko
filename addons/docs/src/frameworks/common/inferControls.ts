import mapValues from 'lodash/mapValues';
import { ArgTypes, ArgType } from '@storybook/addons';
import { Control } from '@storybook/components';
import { SBEnumType } from '../../lib/sbtypes';

const inferControl = (argType: ArgType): Control => {
  const { type } = argType;
  if (!type) {
    // console.log('no sbtype', { argType });
    return null;
  }
  switch (type.name) {
    case 'array': {
      const { value } = type;
      if (value?.name && ['object', 'other'].includes(value.name)) {
        return {
          type: 'object',
          validator: (obj: any) => Array.isArray(obj),
        };
      }
      return { type: 'array' };
    }
    case 'boolean':
      return { type: 'boolean' };
    case 'string':
      return { type: 'text' };
    case 'number':
      return { type: 'number' };
    case 'enum': {
      const { value } = type as SBEnumType;
      return { type: 'options', controlType: 'select', options: value };
    }
    case 'function':
    case 'symbol':
    case 'void':
      return null;
    default:
      return { type: 'object' };
  }
};

export const inferControls = (argTypes: ArgTypes): ArgTypes => {
  return mapValues(argTypes, (argType) => {
    const control = argType && argType.type && inferControl(argType);
    return control ? { control } : undefined;
  });
};
