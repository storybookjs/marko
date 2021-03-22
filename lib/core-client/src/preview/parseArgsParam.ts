import qs from 'qs';
import dedent from 'ts-dedent';
import { Args } from '@storybook/addons';
import { once } from '@storybook/client-logger';
import isPlainObject from 'lodash/isPlainObject';

// Keep this in sync with validateArgs in router/src/utils.ts
const VALIDATION_REGEXP = /^[a-zA-Z0-9 _-]*$/;
const HEX_REGEXP = /^#([a-f0-9]{3,4}|[a-f0-9]{6}|[a-f0-9]{8})$/i;
const COLOR_REGEXP = /^(rgba?|hsla?)\(([0-9]{1,3}),\s?([0-9]{1,3})%?,\s?([0-9]{1,3})%?,?\s?([0-9](\.[0-9]{1,2})?)?\)$/i;
const validateArgs = (key = '', value: unknown): boolean => {
  if (key === null) return false;
  if (key === '' || !VALIDATION_REGEXP.test(key)) return false;
  if (value === null || value === undefined) return true; // encoded as `!null` or `!undefined`
  if (value instanceof Date) return true; // encoded as modified ISO string
  if (typeof value === 'number' || typeof value === 'boolean') return true;
  if (typeof value === 'string')
    return VALIDATION_REGEXP.test(value) || HEX_REGEXP.test(value) || COLOR_REGEXP.test(value);
  if (Array.isArray(value)) return value.every((v) => validateArgs(key, v));
  if (isPlainObject(value)) return Object.entries(value).every(([k, v]) => validateArgs(k, v));
  return false;
};

// Matches ISO date strings that yield a proper value when passed to new Date(...)
// Time offset and can be `Z` or a +/- offset in hours:minutes
// Time offset is optional, falling back to local timezone
// Time part is optional (including offset)
// Second fraction is optional
const DATE_ARG_REGEXP = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|(\+|-)\d{2}:\d{2})?)?$/;

const QS_OPTIONS = {
  delimiter: ';', // we're parsing a single query param
  allowDots: true, // objects are encoded using dot notation
  allowSparse: true, // arrays will be merged on top of their initial value
  decoder(
    str: string,
    defaultDecoder: (str: string, decoder?: any, charset?: string) => string,
    charset: string,
    type: 'key' | 'value'
  ) {
    if (type === 'value' && str === '!undefined') return undefined;
    if (type === 'value' && str === '!null') return null;
    if (type === 'value' && str.startsWith('!')) {
      const raw = str.slice(1);
      if (DATE_ARG_REGEXP.test(raw)) return new Date(raw);
      if (HEX_REGEXP.test(`#${raw}`)) return `#${raw}`;
      const color = raw.match(COLOR_REGEXP);
      if (color)
        return raw.startsWith('rgb')
          ? `${color[1]}(${color[2]}, ${color[3]}, ${color[4]}, ${color[5]})`
          : `${color[1]}(${color[2]}, ${color[3]}%, ${color[4]}%, ${color[5]})`;
    }
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
