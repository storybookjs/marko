import { once } from '@storybook/client-logger';
import deepEqual from 'fast-deep-equal';
import isPlainObject from 'lodash/isPlainObject';
import memoize from 'memoizerific';
import qs from 'qs';
import dedent from 'ts-dedent';

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

export const DEEPLY_EQUAL = Symbol('Deeply equal');
export const deepDiff = (value: any, update: any): any => {
  if (typeof value !== typeof update) return update;
  if (deepEqual(value, update)) return DEEPLY_EQUAL;
  if (Array.isArray(value) && Array.isArray(update)) {
    if (update.length >= value.length) return update;
    return [...update, ...new Array(value.length - update.length)];
  }
  if (isPlainObject(value) && isPlainObject(update)) {
    return Object.keys({ ...value, ...update }).reduce((acc, key) => {
      const diff = deepDiff(value?.[key], update?.[key]);
      return diff === DEEPLY_EQUAL ? acc : Object.assign(acc, { [key]: diff });
    }, {});
  }
  return update;
};

const encodeNullish = (value: unknown): any => {
  if (value === undefined) return '!undefined';
  if (value === null) return '!null';
  if (Array.isArray(value)) return value.map(encodeNullish);
  if (isPlainObject(value)) {
    return Object.entries(value).reduce(
      (acc, [key, val]) => Object.assign(acc, { [key]: encodeNullish(val) }),
      {}
    );
  }
  return value;
};

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
  encode: false, // we handle URL encoding ourselves
  delimiter: ';', // we don't actually create multiple query params
  allowDots: true, // encode objects using dot notation: obj.key=val
  format: 'RFC1738', // encode spaces using the + sign
};
export const buildArgsParam = (initialArgs: Args, args: Args): string => {
  const update = deepDiff(initialArgs, args);
  if (!update || update === DEEPLY_EQUAL) return '';

  const object = Object.entries(update).reduce((acc, [key, value]) => {
    if (validateArgs(key, value)) return Object.assign(acc, { [key]: value });
    once.warn(dedent`
      Omitted potentially unsafe URL args.

      More info: https://storybook.js.org/docs/react/writing-stories/args#setting-args-through-the-url
    `);
    return acc;
  }, {} as Args);

  return qs
    .stringify(encodeNullish(object), QS_OPTIONS)
    .replace(/ /g, '+')
    .split(';')
    .map((part: string) => part.replace('=', ':'))
    .join(';');
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
