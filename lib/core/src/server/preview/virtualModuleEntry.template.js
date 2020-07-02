/* eslint-disable import/no-unresolved */
import { addDecorator, addParameters, addArgTypesEnhancer } from '{{clientApi}}';
import { logger } from '{{clientLogger}}';
import {
  decorators,
  parameters,
  argTypesEnhancers,
  globals,
  globalTypes,
  args,
  argTypes,
} from '{{configFilename}}';

if (args || argTypes) {
  logger.warn('Invalid args/argTypes in config, ignoring.', JSON.stringify({ args, argTypes }));
}
if (decorators) {
  decorators.forEach((decorator) => addDecorator(decorator));
}
if (parameters || globals || globalTypes) {
  addParameters({ ...parameters, globals, globalTypes });
}
if (argTypesEnhancers) {
  argTypesEnhancers.forEach((enhancer) => addArgTypesEnhancer(enhancer));
}
