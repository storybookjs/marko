import mapValues from 'lodash/mapValues';
import { ArgTypesEnhancer, combineParameters } from '@storybook/client-api';
import { inferArgTypes } from './inferArgTypes';
import { inferControls } from './inferControls';
import { normalizeArgTypes } from './normalizeArgTypes';

const isSubset = (kind: string, subset: object, superset: object) => {
  const keys = Object.keys(subset);
  // eslint-disable-next-line no-prototype-builtins
  const overlap = keys.filter((key) => superset.hasOwnProperty(key));
  return overlap.length === keys.length;
};

export const enhanceArgTypes: ArgTypesEnhancer = (context) => {
  const { component, argTypes: userArgTypes = {}, docs = {}, args = {} } = context.parameters;
  const { extractArgTypes } = docs;

  const normalizedArgTypes = normalizeArgTypes(userArgTypes);
  const namedArgTypes = mapValues(normalizedArgTypes, (val, key) => ({ name: key, ...val }));
  const inferredArgTypes = inferArgTypes(args);
  const extractedArgTypes = extractArgTypes && component ? extractArgTypes(component) : {};
  const withArgTypes = combineParameters(inferredArgTypes, extractedArgTypes, namedArgTypes);

  if (context.storyFn.length === 0) {
    return withArgTypes;
  }

  const withControls = inferControls(withArgTypes);
  const result = combineParameters(withControls, withArgTypes);
  return result;
};
