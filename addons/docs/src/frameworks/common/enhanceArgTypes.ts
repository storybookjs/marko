import mapValues from 'lodash/mapValues';
import { ArgTypesEnhancer, combineParameters } from '@storybook/client-api';
import { normalizeArgTypes } from './normalizeArgTypes';

export const enhanceArgTypes: ArgTypesEnhancer = (context) => {
  const { component, argTypes: userArgTypes = {}, docs = {} } = context.parameters;
  const { extractArgTypes } = docs;

  const normalizedArgTypes = normalizeArgTypes(userArgTypes);
  const namedArgTypes = mapValues(normalizedArgTypes, (val, key) => ({ name: key, ...val }));
  const extractedArgTypes = extractArgTypes && component ? extractArgTypes(component) : {};
  const withExtractedTypes = extractedArgTypes
    ? combineParameters(extractedArgTypes, namedArgTypes)
    : namedArgTypes;

  return withExtractedTypes;
};
