const build = require('@storybook/core/standalone');
const frameworkOptions = require('./dist/ts3.9/server/options').default;

async function buildStandalone(options) {
  return build(options, frameworkOptions);
}

module.exports = buildStandalone;
