import camelCase from 'lodash/camelCase';
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

  const namedArgTypes = Object.entries(userArgTypes as ArgTypes).reduce((acc, [key, val]) => {
    acc[key] = { name: key, ...val };
    return acc;
  }, {} as ArgTypes);

  const inferredArgTypes = inferArgTypes(args);
  const components = { Primary: component, ...subcomponents };
  let extractedArgTypes: ArgTypes = {};

  if (extractArgTypes && components) {
    const componentArgTypes = Object.entries(components).reduce((acc, [label, comp]) => {
      acc[label] = extractArgTypes(comp);
      return acc;
    }, {} as Record<string, ArgTypes>);

    extractedArgTypes = Object.entries(componentArgTypes).reduce((acc, [label, compTypes]) => {
      if (compTypes) {
        Object.entries(compTypes).forEach(([key, argType]) => {
          const subLabel = label === 'Primary' ? key : camelCase(`${label} ${key}`);
          acc[subLabel] = argType;
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
