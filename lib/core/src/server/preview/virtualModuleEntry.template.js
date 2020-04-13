const { addDecorator, addParameters, addArgsEnhancer } = require('{{clientApi}}');
const { logger } = require('{{clientLogger}}');
const {
  decorators,
  parameters,
  argsEnhancers,
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
if (argsEnhancers) {
  argsEnhancers.forEach((enhancer) => addArgsEnhancer(enhancer));
}
