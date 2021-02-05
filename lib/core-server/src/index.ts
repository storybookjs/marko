const serverUtils = require('@storybook/core-common/dist/cjs/utils/template');
const buildStatic = require('./build-static');
const buildDev = require('./build-dev');

const managerPreset = require.resolve('./presets/manager-preset');

module.exports = {
  managerPreset,
  ...buildStatic,
  ...buildDev,
  ...serverUtils,
};
