import mapValues from 'lodash/mapValues';
import { ArgTypesEnhancer, combineParameters } from '@storybook/client-api';
import { ArgTypes } from '@storybook/api';
import { inferArgTypes } from './inferArgTypes';
import { inferControls } from './inferControls';

const isSubset = (kind: string, subset: object, superset: object) => {
  const keys = Object.keys(subset);
  // eslint-disable-next-line no-prototype-builtins
  const overlap = keys.filter((key) => superset.hasOwnProperty(key));
  return overlap.length === keys.length;
};

export const enhanceArgTypes: ArgTypesEnhancer = (context) => {
  const { component, argTypes: userArgTypes = {}, docs = {}, args = {} } = context.parameters;
  const { extractArgTypes, forceExtractedArgTypes = false } = docs;

  const namedArgTypes = mapValues(userArgTypes, (val, key) => ({ name: key, ...val }));
  const inferredArgTypes = inferArgTypes(args);
  let extractedArgTypes: ArgTypes = extractArgTypes && component ? extractArgTypes(component) : {};

  if (
    !forceExtractedArgTypes &&
    ((Object.keys(userArgTypes).length > 0 &&
      !isSubset(context.kind, userArgTypes, extractedArgTypes)) ||
      (Object.keys(inferredArgTypes).length > 0 &&
        !isSubset(context.kind, inferredArgTypes, extractedArgTypes)))
  ) {
    extractedArgTypes = {};
  }

  const withArgTypes = combineParameters(inferredArgTypes, extractedArgTypes, namedArgTypes);

  if (context.storyFn.length === 0) {
    return withArgTypes;
  }

  const withControls = inferControls(withArgTypes);
  const result = combineParameters(withControls, withArgTypes);
  return result;
};
