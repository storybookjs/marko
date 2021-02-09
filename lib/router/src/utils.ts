import qs from 'qs';
import memoize from 'memoizerific';

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

const JS_IDENTIFIER_REGEXP = /^[A-Z_$][0-9A-Z_$]*$/i;
const EXTENDED_ALPHANUM_REGEXP = /^[0-9A-Z _-]*$/i;
const QS_OPTIONS = { allowDots: true, delimiter: ';', encode: false, arrayFormat: 'brackets' };

// Keep this in sync with validateArgs in @storybook/core
const validateArgs = (key: any, value: any): boolean => {
  if (!key || !value) return false;
  if (!JS_IDENTIFIER_REGEXP.test(key)) return false;
  if (typeof value === 'string') return EXTENDED_ALPHANUM_REGEXP.test(value);
  if (Array.isArray(value)) return value.every((v) => validateArgs(key, v));
  return Object.entries(value).every(([k, v]) => validateArgs(k, v));
};

export const buildArgsParam = (args: Args) => {
  const object = Object.entries(args).reduce(
    (acc, [key, value]) => (validateArgs(key, value) ? Object.assign(acc, { [key]: value }) : acc),
    {} as Args
  );
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
