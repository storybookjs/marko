/* eslint-disable import/no-unresolved */
import { addDecorator, addParameters, addLoader, addArgTypesEnhancer } from '{{clientApi}}';
import { logger } from '{{clientLogger}}';
import {
  decorators,
  parameters,
  loaders,
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
  decorators.forEach((decorator) => addDecorator(decorator, false));
}
if (loaders) {
  loaders.forEach((loader) => addLoader(loader, false));
}
if (parameters || globals || globalTypes) {
  addParameters({ ...parameters, globals, globalTypes }, false);
}
if (argTypesEnhancers) {
  argTypesEnhancers.forEach((enhancer) => addArgTypesEnhancer(enhancer));
}
