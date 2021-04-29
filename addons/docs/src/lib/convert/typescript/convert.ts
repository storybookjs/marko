/* eslint-disable no-case-declarations */
import { SBType } from '@storybook/client-api';
import { TSType, TSSigType } from './types';

const convertSig = (type: TSSigType) => {
  switch (type.type) {
    case 'function':
      return { name: 'function' };
    case 'object':
      const values: any = {};
      type.signature.properties.forEach((prop) => {
        values[prop.key] = convert(prop.value);
      });
      return {
        name: 'object',
        value: values,
      };
    default:
      throw new Error(`Unknown: ${type}`);
  }
};

export const convert = (type: TSType): SBType | void => {
  const { name, raw } = type;
  const base: any = {};
  if (typeof raw !== 'undefined') base.raw = raw;
  switch (type.name) {
    case 'string':
    case 'number':
    case 'symbol':
    case 'boolean': {
      return { ...base, name };
    }
    case 'Array': {
      return { ...base, name: 'array', value: type.elements.map(convert) };
    }
    case 'signature':
      return { ...base, ...convertSig(type) };
    case 'union':
    case 'intersection':
      return { ...base, name, value: type.elements.map(convert) };
    default:
      return { ...base, name: 'other', value: name };
  }
};
