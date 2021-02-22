import { logger } from '@storybook/node-logger';
import { loadCustomWebpackConfig } from '@storybook/core-common';
import { createDefaultWebpackConfig } from '../preview/base-webpack.config';

export async function webpack(config: any, options: any) {
  const { configDir, configType, presets, webpackConfig } = options;
  const defaultConfig = await createDefaultWebpackConfig(config, options);
  const finalDefaultConfig = await presets.apply('webpackFinal', defaultConfig, options);

  // through standalone webpackConfig option
  if (webpackConfig) {
    return webpackConfig(finalDefaultConfig);
  }

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  const customConfig = loadCustomWebpackConfig(configDir);

  if (typeof customConfig === 'function') {
    logger.info('=> Loading custom Webpack config (full-control mode).');
    return customConfig({ config: finalDefaultConfig, mode: configType });
  }

  logger.info('=> Using default Webpack4 setup');
  return finalDefaultConfig;
}
