import { TransformOptions } from '@babel/core';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import type { Configuration } from 'webpack';
import type { StorybookOptions } from '@storybook/core/types';
import webpack from 'webpack';

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

export function webpackFinal(config: Configuration) {
  const isDevelopment = config.mode === 'development';
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        isDevelopment && {
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
    plugins: [...config.plugins, isDevelopment && new ReactRefreshWebpackPlugin()].filter(Boolean),
  };
}
