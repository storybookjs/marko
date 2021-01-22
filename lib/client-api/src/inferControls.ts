import mapValues from 'lodash/mapValues';
import { ArgType } from '@storybook/addons';
import { SBEnumType, ArgTypesEnhancer } from './types';
import { combineParameters } from './parameters';

type ControlsConfig = {
  include?: string[];
  exclude?: string[];
};

const inferControl = (argType: ArgType): any => {
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

const includeExcludeCheck = (key: string, { include, exclude }: ControlsConfig) => {
  if (include && exclude) {
    throw new Error(
      `Addon-controls: found both "include" and "exclude" keys in parameter. You should use only one of them.`
    );
  }

  if (include && include.length) {
    return include.indexOf(key) !== -1;
  }

  if (exclude && exclude.length) {
    return exclude.indexOf(key) === -1;
  }

  return true;
};

export const inferControls: ArgTypesEnhancer = (context) => {
  const { __isArgsStory, argTypes, controls: controlsConfig } = context.parameters;
  if (!__isArgsStory) return argTypes;

  let filteredArgTypes = argTypes;
  if (controlsConfig.include || controlsConfig.exclude) {
    filteredArgTypes = argTypes.filter((name: string) => includeExcludeCheck(name, controlsConfig));
  }

  const withControls = mapValues(filteredArgTypes, (argType, name) => {
    const control = argType && argType.type && inferControl(argType);
    return control ? { control } : undefined;
  });
  return combineParameters(withControls, filteredArgTypes);
};
