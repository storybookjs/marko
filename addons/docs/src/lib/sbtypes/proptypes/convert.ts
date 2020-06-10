/* eslint-disable no-case-declarations */
import mapValues from 'lodash/mapValues';
import { PTType } from './types';
import { SBType } from '../types';
import { trimQuotes } from '../utils';

const SIGNATURE_REGEXP = /^\(.*\) => /;

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
    case 'boolean':
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
    default: {
      if (name?.indexOf('|') > 0) {
        // react-docgen-typescript-loader doesn't always produce proper
        // enum types, possibly due to https://github.com/strothj/react-docgen-typescript-loader/issues/81
        // this hack tries to parse out values from the string and should be
        // removed when RDTL gets a little smarter about this
        try {
          const literalValues = name.split('|').map((v: string) => JSON.parse(v));
          return { ...base, name: 'enum', value: literalValues };
        } catch (err) {
          // fall through
        }
      }
      const otherVal = value ? `${name}(${value})` : name;
      const otherName = SIGNATURE_REGEXP.test(name) ? 'function' : 'other';

      return { ...base, name: otherName, value: otherVal };
    }
  }
};
