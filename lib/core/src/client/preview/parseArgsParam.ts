import qs from 'qs';
import { Args } from '@storybook/addons';

const JS_IDENTIFIER_REGEXP = /^[A-Z_$][0-9A-Z_$]*$/i;
const EXTENDED_ALPHANUM_REGEXP = /^[0-9A-Z _-]*$/i;
const QS_OPTIONS = { allowDots: true, delimiter: ';' };

// Keep this in sync with validateArgs in @storybook/router
const validateArgs = (key: any, value: any): boolean => {
  if (!key || !value) return false;
  if (!JS_IDENTIFIER_REGEXP.test(key)) return false;
  if (typeof value === 'string') return EXTENDED_ALPHANUM_REGEXP.test(value);
  if (Array.isArray(value)) return value.every((v) => validateArgs(key, v));
  return Object.entries(value).every(([k, v]) => validateArgs(k, v));
};

export const parseArgsParam = (argsString: string): Args => {
  const parts = argsString.split(';').map((part) => part.replace('=', '~').replace(':', '='));
  return Object.entries(qs.parse(parts.join(';'), QS_OPTIONS)).reduce(
    (acc, [key, value]) => (validateArgs(key, value) ? Object.assign(acc, { [key]: value }) : acc),
    {} as Args
  );
};
