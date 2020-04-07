import camelCase from 'lodash/camelCase';
import { ParameterEnhancer, combineParameters } from '@storybook/client-api';
import { ArgTypes } from '@storybook/api';
import { inferArgTypes } from './inferArgTypes';

const isSubset = (kind: string, subset: object, superset: object) => {
  const keys = Object.keys(subset);
  // eslint-disable-next-line no-prototype-builtins
  const overlap = keys.filter((key) => superset.hasOwnProperty(key));
  if (kind === 'Addons/Docs/props') {
    console.log('isSubset', { overlap: overlap.length, keys: keys.length });
  }
  return overlap.length === keys.length;
};

export const enhanceArgTypes: ParameterEnhancer = (context) => {
  const { parameters } = context;
  const { component, subcomponents, args = {}, argTypes = {}, docs = {} } = parameters;
  const { extractArgTypes } = docs;
  // if (context.storyFn.length === 0 || !component || !extractArgTypes) {
  if (!component || !extractArgTypes) {
    return null;
  }

  const namedArgTypes = Object.entries(argTypes as ArgTypes).reduce((acc, [key, val]) => {
    acc[key] = { name: key, ...val };
    return acc;
  }, {} as ArgTypes);

  const inferredArgTypes = inferArgTypes(args);
  const components = { Primary: component, ...subcomponents };
  let extractedArgTypes: ArgTypes;

  const componentArgTypes = Object.entries(components).reduce((acc, [label, comp]) => {
    acc[label] = extractArgTypes(comp);
    return acc;
  }, {} as Record<string, ArgTypes>);

  extractedArgTypes = Object.entries(componentArgTypes).reduce((acc, [label, compTypes]) => {
    Object.entries(compTypes).forEach(([key, argType]) => {
      const subLabel = label === 'Primary' ? key : camelCase(`${label} ${key}`);
      acc[subLabel] = argType;
    });
    return acc;
  }, {} as ArgTypes);

  if (context.kind === 'Addons/Docs/props') {
    console.log('input args', { args });
    console.log('inferredArgTypes', { inferredArgTypes });
    console.log('namedArgTypes', { namedArgTypes });
  }

  if (
    (Object.keys(argTypes).length > 0 && !isSubset(context.kind, extractedArgTypes, argTypes)) ||
    (Object.keys(inferredArgTypes).length > 0 &&
      !isSubset(context.kind, extractedArgTypes, inferredArgTypes))
  ) {
    extractedArgTypes = {};
  }

  const withArgTypes = combineParameters(
    { argTypes: namedArgTypes },
    { argTypes: inferredArgTypes },
    { argTypes: extractedArgTypes, componentArgTypes }
  );

  return withArgTypes;
};
