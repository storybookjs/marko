import qs from 'qs';
import { Args } from '@storybook/addons';
import { once } from '@storybook/client-logger';

// Keep this in sync with validateArgs in @storybook/core
const VALIDATION_REGEXP = /^[a-zA-Z0-9 _-]*$/;
const validateArgs = (key = '', value: any = ''): boolean => {
  if (key === null || value === null) return false;
  if (key === '' || !VALIDATION_REGEXP.test(key)) return false;
  if (typeof value === 'string') return VALIDATION_REGEXP.test(value);
  if (Array.isArray(value)) return value.every((v) => validateArgs(key, v));
  return Object.entries(value).every(([k, v]) => validateArgs(k, v));
};

const QS_OPTIONS = {
  delimiter: ';', // we're parsing a single query param
  allowDots: true, // objects are encoded using dot notation
};
export const parseArgsParam = (argsString: string): Args => {
  const parts = argsString.split(';').map((part) => part.replace('=', '~').replace(':', '='));
  return Object.entries(qs.parse(parts.join(';'), QS_OPTIONS)).reduce((acc, [key, value]) => {
    if (validateArgs(key, value)) return Object.assign(acc, { [key]: value });
    once.warn(
      'Omitted potentially unsafe URL args.\n\nMore info: https://storybook.js.org/docs/react/writing-stories/args#setting-args-through-the-url'
    );
    return acc;
  }, {} as Args);
};
