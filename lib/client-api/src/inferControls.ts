import mapValues from 'lodash/mapValues';
import { ArgType } from '@storybook/addons';
import { SBEnumType, ArgTypesEnhancer } from './types';
import { combineParameters } from './parameters';
import { filterArgTypes } from './filterArgTypes';

type ControlsMatchers = {
  date: RegExp;
  color: RegExp;
};

const inferControl = (argType: ArgType, name: string, matchers: ControlsMatchers): any => {
  const { type } = argType;
  if (!type) {
    return null;
  }

  // args that end with background or color e.g. iconColor
  if (matchers.color && matchers.color.test(name)) {
    return { type: 'color' };
  }

  // args that end with date e.g. purchaseDate
  if (matchers.date && matchers.date.test(name)) {
    return { type: 'date' };
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
      if (value?.length <= 5) {
        return { type: 'radio', options: value };
      }
      return { type: 'select', options: value };
    }
    case 'function':
    case 'symbol':
    case 'void':
      return null;
    default:
      return { type: 'object' };
  }
};

export const inferControls: ArgTypesEnhancer = (context) => {
  const {
    __isArgsStory,
    argTypes,
    controls: { include = null, exclude = null, matchers = {} } = {},
  } = context.parameters;
  if (!__isArgsStory) return argTypes;

  const filteredArgTypes = filterArgTypes(argTypes, include, exclude);
  const withControls = mapValues(filteredArgTypes, (argType, name) => {
    const control = argType?.type && inferControl(argType, name, matchers);
    return control ? { control } : undefined;
  });

  return combineParameters(withControls, filteredArgTypes);
};
