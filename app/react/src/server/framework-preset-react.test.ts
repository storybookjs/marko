import webpack from 'webpack';
import * as preset from './framework-preset-react';
import type { StorybookOptions } from './types';

describe('framework-preset-react', () => {
  const babelLoaderPath = require.resolve('babel-loader');
  const reactRefreshPath = require.resolve('react-refresh/babel');
  const webpackConfigMock: webpack.Configuration = {
    mode: 'development',
    plugins: [],
    module: {
      rules: [],
    },
  };

  describe('webpackFinal', () => {
    it('should return a config with fast refresh plugin when fast refresh is enabled', () => {
      const config = preset.webpackFinal(webpackConfigMock, {
        reactOptions: { fastRefresh: true },
      } as StorybookOptions);

      expect(config.module.rules).toEqual([
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: babelLoaderPath,
              options: {
                plugins: [reactRefreshPath],
              },
            },
          ],
        },
      ]);
    });

    it('should not return a config with fast refresh plugin when fast refresh is disabled', () => {
      const config = preset.webpackFinal(webpackConfigMock, {
        reactOptions: { fastRefresh: false },
      } as StorybookOptions);

      expect(config.module.rules).toEqual([]);
    });

    it('should not return a config with fast refresh plugin when mode is not development', () => {
      const config = preset.webpackFinal({ ...webpackConfigMock, mode: 'production' }, {
        reactOptions: { fastRefresh: true },
      } as StorybookOptions);

      expect(config.module.rules).toEqual([]);
    });
  });
});
