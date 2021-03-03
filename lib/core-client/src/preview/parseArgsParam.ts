import qs from 'qs';
import dedent from 'ts-dedent';
import { Args } from '@storybook/addons';
import { once } from '@storybook/client-logger';
import isPlainObject from 'lodash/isPlainObject';

// Keep this in sync with validateArgs in @storybook/core
const VALIDATION_REGEXP = /^[a-zA-Z0-9 _-]*$/;
const validateArgs = (key = '', value: unknown): boolean => {
  if (value === null || value === undefined) return true; // encoded as `!null` or `!undefined`
  if (key === null) return false;
  if (key === '' || !VALIDATION_REGEXP.test(key)) return false;
  if (typeof value === 'number' || typeof value === 'boolean') return true;
  if (typeof value === 'string') return VALIDATION_REGEXP.test(value);
  if (Array.isArray(value)) return value.every((v) => validateArgs(key, v));
  if (isPlainObject(value)) return Object.entries(value).every(([k, v]) => validateArgs(k, v));
  return false;
};

const QS_OPTIONS = {
  delimiter: ';', // we're parsing a single query param
  allowDots: true, // objects are encoded using dot notation
  decoder(
    str: string,
    defaultDecoder: (str: string, decoder?: any, charset?: string) => string,
    charset: string,
    type: 'key' | 'value'
  ) {
    if (type === 'value' && str === '!undefined') return undefined;
    if (type === 'value' && str === '!null') return null;
    return defaultDecoder(str, defaultDecoder, charset);
  },
};
export const parseArgsParam = (argsString: string): Args => {
  const parts = argsString.split(';').map((part) => part.replace('=', '~').replace(':', '='));
  return Object.entries(qs.parse(parts.join(';'), QS_OPTIONS)).reduce((acc, [key, value]) => {
    if (validateArgs(key, value)) return Object.assign(acc, { [key]: value });
    once.warn(dedent`
      Omitted potentially unsafe URL args.

      More info: https://storybook.js.org/docs/react/writing-stories/args#setting-args-through-the-url
    `);
    return acc;
  }, {} as Args);
};
