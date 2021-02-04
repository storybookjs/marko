const serverUtils = require('./utils/template');
const buildStatic = require('./build-static');
const buildDev = require('./build-dev');

const managerPreset = require.resolve('./manager/manager-preset');

module.exports = {
  managerPreset,
  ...buildStatic,
  ...buildDev,
  ...serverUtils,
};
