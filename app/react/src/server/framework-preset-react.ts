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

export function webpackFinal(config: Configuration, { typescriptOptions }: StorybookOptions) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
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
      ],
    },
    plugins: [
      ...config.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin({
        overlay: {
          sockIntegration: 'whm',
        },
      }),
    ],
  };
}
