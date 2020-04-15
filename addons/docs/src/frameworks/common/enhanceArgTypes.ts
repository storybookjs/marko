import camelCase from 'lodash/camelCase';
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
  const {
    component,
    subcomponents,
    argTypes: userArgTypes = {},
    docs = {},
    args = {},
  } = context.parameters;
  const { extractArgTypes } = docs;

  const namedArgTypes = mapValues(userArgTypes, (val, key) => ({ name: key, ...val }));
  const inferredArgTypes = inferArgTypes(args);
  const components = { Primary: component, ...subcomponents };
  let extractedArgTypes: ArgTypes = {};

  if (extractArgTypes && components) {
    const componentArgTypes = mapValues(components, (comp) => extractArgTypes(comp));
    extractedArgTypes = Object.entries(componentArgTypes).reduce((acc, [label, compTypes]) => {
      if (compTypes) {
        Object.entries(compTypes).forEach(([key, argType]) => {
          if (label === 'Primary') {
            acc[key] = argType;
          }
        });
      }
      return acc;
    }, {} as ArgTypes);
  }

  if (
    (Object.keys(userArgTypes).length > 0 &&
      !isSubset(context.kind, userArgTypes, extractedArgTypes)) ||
    (Object.keys(inferredArgTypes).length > 0 &&
      !isSubset(context.kind, inferredArgTypes, extractedArgTypes))
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
