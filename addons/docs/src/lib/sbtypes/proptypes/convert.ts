/* eslint-disable no-case-declarations */
import mapValues from 'lodash/mapValues';
import { PTType } from './types';
import { SBType } from '../types';

const QUOTE_REGEX = /^['"]|['"]$/g;
const trimQuotes = (str: string) => str.replace(QUOTE_REGEX, '');

export const convert = (type: PTType): SBType | any => {
  const { name, raw, computed, value } = type;
  const base: any = {};
  if (typeof raw !== 'undefined') base.raw = raw;
  switch (name) {
    case 'enum': {
      const values = computed ? value : value.map((v: PTType) => trimQuotes(v.value));
      return { ...base, name, value: values };
    }
    case 'string':
    case 'number':
    case 'symbol':
      return { ...base, name };
    case 'func':
      return { ...base, name: 'function' };
    case 'bool':
      return { ...base, name: 'boolean' };
    case 'arrayOf':
    case 'array':
      return { ...base, name: 'array', value: value && convert(value as PTType) };
    case 'object':
      return { ...base, name };
    case 'objectOf':
      return { ...base, name, value: convert(value as PTType) };
    case 'shape':
    case 'exact':
      const values = mapValues(value, (field) => convert(field));
      return { ...base, name: 'object', value: values };
    case 'union':
      return { ...base, name: 'union', value: value.map((v: PTType) => convert(v)) };
    case 'instanceOf':
    case 'element':
    case 'elementType':
    default:
      const otherVal = value ? `${name}(${value})` : name;
      return { ...base, name: 'other', value: otherVal };
  }
};
