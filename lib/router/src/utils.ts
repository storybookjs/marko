import qs from 'qs';
import memoize from 'memoizerific';
import { once } from '@storybook/client-logger';

export interface StoryData {
  viewMode?: string;
  storyId?: string;
  refId?: string;
}

const splitPathRegex = /\/([^/]+)\/(?:(.*)_)?([^/]+)?/;

export const parsePath: (path: string | undefined) => StoryData = memoize(1000)(
  (path: string | undefined | null) => {
    const result: StoryData = {
      viewMode: undefined,
      storyId: undefined,
      refId: undefined,
    };

    if (path) {
      const [, viewMode, refId, storyId] = path.toLowerCase().match(splitPathRegex) || [];
      if (viewMode) {
        Object.assign(result, {
          viewMode,
          storyId,
          refId,
        });
      }
    }
    return result;
  }
);

interface Args {
  [key: string]: any;
}

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
  encode: false, // we handle URL encoding ourselves
  delimiter: ';', // we don't actually create multiple query params
  allowDots: true, // encode objects using dot notation: obj.key=val
  arrayFormat: 'brackets', // encode arrays using brackets without indices: arr[]=one&arr[]=two
  format: 'RFC1738', // encode spaces using the + sign
};
export const buildArgsParam = (args: Args) => {
  const object = Object.entries(args).reduce((acc, [key, value]) => {
    if (validateArgs(key, value)) return Object.assign(acc, { [key]: value });
    once.warn(
      'Some args cannot be safely serialized to the URL. See https://storybook.js.org/docs/react/writing-stories/args#setting-args-through-the-url'
    );
    return acc;
  }, {} as Args);
  const parts = qs.stringify(object, QS_OPTIONS).split(';');
  return parts.map((part: string) => part.replace('=', ':')).join(';');
};

interface Query {
  [key: string]: any;
}

export const queryFromString = memoize(1000)(
  (s: string): Query => qs.parse(s, { ignoreQueryPrefix: true })
);
export const queryFromLocation = (location: { search: string }) => queryFromString(location.search);
export const stringifyQuery = (query: Query) =>
  qs.stringify(query, { addQueryPrefix: true, encode: false });

type Match = { path: string };

export const getMatch = memoize(1000)(
  (current: string, target: string, startsWith = true): Match | null => {
    const startsWithTarget = current && startsWith && current.startsWith(target);
    const currentIsTarget = typeof target === 'string' && current === target;
    const matchTarget = current && target && current.match(target);

    if (startsWithTarget || currentIsTarget || matchTarget) {
      return { path: current };
    }

    return null;
  }
);
