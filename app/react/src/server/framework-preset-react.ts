import { TransformOptions } from '@babel/core';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import type { Configuration } from 'webpack';

import { logger } from '@storybook/node-logger';
import type { StorybookOptions } from '@storybook/core/types';

export async function babel(config: TransformOptions, options: StorybookOptions) {
  const isDevelopment = options.configType === 'DEVELOPMENT';
  const reactOptions = await options.presets.apply('reactOptions', {}, options);
  const fastRefreshEnabled =
    isDevelopment && (reactOptions.fastRefresh || process.env.FAST_REFRESH === 'true');

  if (!fastRefreshEnabled) {
    return config;
  }

  return {
    ...config,
    plugins: [require.resolve('react-refresh/babel'), ...(config.plugins || [])],
  };
}

export async function babelDefault(config: TransformOptions) {
  return {
    ...config,
    presets: [
      ...config.presets,
      require.resolve('@babel/preset-react'),
      require.resolve('@babel/preset-flow'),
    ],
    plugins: [...(config.plugins || []), require.resolve('babel-plugin-add-react-displayname')],
  };
}

export async function webpackFinal(config: Configuration, options: StorybookOptions) {
  const isDevelopment = options.configType === 'DEVELOPMENT';
  const reactOptions = await options.presets.apply('reactOptions', {}, options);
  const fastRefreshEnabled =
    isDevelopment && (reactOptions.fastRefresh || process.env.FAST_REFRESH === 'true');

  if (!fastRefreshEnabled) {
    return config;
  }

  logger.info('=> Using React fast refresh feature.');
  return {
    ...config,
    plugins: [...(config.plugins || []), new ReactRefreshWebpackPlugin()],
  };
}
