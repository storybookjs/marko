const defaultWebpackConfig = require('./dist/cjs/server/preview/base-webpack.config');
const serverUtils = require('./dist/cjs/server/utils/template');
const buildStatic = require('./dist/cjs/server/build-static');
const buildDev = require('./dist/cjs/server/build-dev');
const toRequireContext = require('./dist/cjs/server/preview/to-require-context');

const managerPreset = require.resolve('./dist/cjs/server/manager/manager-preset');

module.exports = {
  managerPreset,
  ...defaultWebpackConfig,
  ...buildStatic,
  ...buildDev,
  ...serverUtils,
  ...toRequireContext,
};
