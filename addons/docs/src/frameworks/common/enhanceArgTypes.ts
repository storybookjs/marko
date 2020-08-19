import mapValues from 'lodash/mapValues';
import { ArgTypesEnhancer, combineParameters } from '@storybook/client-api';
import { inferControls } from './inferControls';
import { normalizeArgTypes } from './normalizeArgTypes';

export const enhanceArgTypes: ArgTypesEnhancer = (context) => {
  const { __isArgsStory, component, argTypes: userArgTypes = {}, docs = {} } = context.parameters;
  const { extractArgTypes } = docs;

  const normalizedArgTypes = normalizeArgTypes(userArgTypes);
  const namedArgTypes = mapValues(normalizedArgTypes, (val, key) => ({ name: key, ...val }));
  const extractedArgTypes = extractArgTypes && component ? extractArgTypes(component) : {};
  const withArgTypes = extractedArgTypes
    ? combineParameters(extractedArgTypes, namedArgTypes)
    : namedArgTypes;

  if (!__isArgsStory) {
    return withArgTypes;
  }

  const withControls = inferControls(withArgTypes);
  const result = combineParameters(withControls, withArgTypes);
  return result;
};
