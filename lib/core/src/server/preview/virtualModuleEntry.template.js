import { addDecorator, addParameters, addParameterEnhancer } from '@storybook/client-api';
import { logger } from '@storybook/client-logger';

const {
  decorators,
  parameters,
  parameterEnhancers,
  globalArgs,
  globalArgTypes,
  args,
  argTypes,
} = require('{{configFilename}}');

if (args || argTypes) {
  logger.warn('Invalid args/argTypes in config, ignoring.', JSON.stringify({ args, argTypes }));
}
if (decorators) {
  decorators.forEach((decorator) => addDecorator(decorator));
}
if (parameters || globalArgs || globalArgTypes) {
  addParameters({ ...parameters, globalArgs, globalArgTypes });
}
if (parameterEnhancers) {
  parameterEnhancers.forEach((enhancer) => addParameterEnhancer(enhancer));
}
