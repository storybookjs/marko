import { TransformOptions } from '@babel/core';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import type { Configuration } from 'webpack';
import { logger } from '@storybook/node-logger';
import type { StorybookOptions } from './types';

export function babelDefault(config: TransformOptions) {
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

export function webpackFinal(config: Configuration, { reactOptions }: StorybookOptions) {
  const isDevelopment = config.mode === 'development';
  const fastRefreshEnabled =
    isDevelopment && (reactOptions?.fastRefresh || process.env.FAST_REFRESH === 'true');
  if (fastRefreshEnabled) {
    logger.info('=> Using React fast refresh feature.');
  }
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        fastRefreshEnabled && {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                plugins: [require.resolve('react-refresh/babel')],
              },
            },
          ],
        },
      ].filter(Boolean),
    },
    plugins: [...config.plugins, fastRefreshEnabled && new ReactRefreshWebpackPlugin()].filter(
      Boolean
    ),
  };
}
