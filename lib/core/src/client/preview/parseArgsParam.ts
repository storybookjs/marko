import qs from 'qs';
import { Args } from '@storybook/addons';

const VALIDATION_REGEXP = /^[a-zA-Z0-9 _-]+$/;
const QS_OPTIONS = {
  delimiter: ';', // we're parsing a single query param
  allowDots: true, // objects are encoded using dot notation
};

// Keep this in sync with validateArgs in @storybook/router
const validateArgs = (key: any, value: any): boolean => {
  if (!key || !value) return false;
  if (!VALIDATION_REGEXP.test(key)) return false;
  if (typeof value === 'string') return VALIDATION_REGEXP.test(value);
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
