const { addDecorator, addParameters, addParameterEnhancer } = require('{{clientApi}}');
const { logger } = require('{{clientLogger}}');
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
