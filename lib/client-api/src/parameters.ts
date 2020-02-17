// Utilities for handling parameters
import isPlainObject from 'is-plain-object';
import mergeWith from 'lodash/mergeWith';
import isEqual from 'lodash/isEqual';
import { logger } from '@storybook/client-logger';

import { Parameters } from '@storybook/addons';

// merge with concatenating arrays, but no duplicates
export const mergeParameter = (a: any, b: any) =>
  mergeWith({}, a, b, (objValue, srcValue) => {
    if (Array.isArray(srcValue) && Array.isArray(objValue)) {
      srcValue.forEach(s => {
        const existing = objValue.find(o => o === s || isEqual(o, s));
        if (!existing) {
          objValue.push(s);
        }
      });

      return objValue;
    }
    if (Array.isArray(objValue)) {
      logger.log('the types mismatch, picking', objValue);
      return objValue;
    }
    return undefined;
  });

// mergeSubkeys is a list of keys to be handled specially -- the individual items should be merged:
//   (defaults to *all*)
// e.g.
//   combineParameters([{ a: { b: { c: 'd' } }}, { a: { b: { e: 'f' }}}]) ==> { a: { b: { e: 'f' } } }
// but:
//   combineParameters([{ a: { b: { c: 'd' } }}, { a: { b: { c: 'e' }}}], ['b']) ==> { a: { b: { c: 'd', e: 'f' } } }
export function combineParameters(parameters: Parameters[], mergeSubkeys?: string[]) {
  return parameters.reduce((acc: Parameters, p) => {
    if (p) {
      Object.entries(p).forEach(([key, value]) => {
        const existingValue = acc[key];

        if (Array.isArray(value)) {
          acc[key] = value;
        } else if (isPlainObject(value) && isPlainObject(existingValue)) {
          if (mergeSubkeys && !mergeSubkeys.includes(key)) {
            acc[key] = value;
          } else {
            acc[key] = mergeParameter(existingValue, value);
          }
        } else {
          acc[key] = value;
        }
      });
    }
    return acc;
  }, {});
}
