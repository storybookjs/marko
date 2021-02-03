const defaultWebpackConfig = require('./preview/base-webpack.config');
const serverUtils = require('./utils/template');
const buildStatic = require('./build-static');
const buildDev = require('./build-dev');
const toRequireContext = require('./preview/to-require-context');

const managerPreset = require.resolve('./manager/manager-preset');

module.exports = {
  managerPreset,
  ...defaultWebpackConfig,
  ...buildStatic,
  ...buildDev,
  ...serverUtils,
  ...toRequireContext,
};
