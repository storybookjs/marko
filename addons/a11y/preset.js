/* eslint-disable no-param-reassign */
function managerEntries(entry = []) {
  return [...entry, require.resolve('./dist/esm/register')];
}

function config(entry = []) {
  return [
    ...entry,
    require.resolve('./dist/esm/a11yRunner'),
    require.resolve('./dist/esm/a11yHighlight'),
  ];
}

async function webpack(webpackConfig, options) {
  const core = await options.presets.apply('core');
  if ((core && core.builder) !== 'webpack5') {
    return webpackConfig;
  }
  if (!webpackConfig.resolve.fallback) {
    webpackConfig.resolve.fallback = {};
  }
  webpackConfig.resolve.fallback.crypto = false;

  return webpackConfig;
}

module.exports = { managerEntries, config, webpack };
