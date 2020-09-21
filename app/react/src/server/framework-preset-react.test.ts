import webpack from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import * as preset from './framework-preset-react';
import type { StorybookOptions } from './types';

const mockApply = jest.fn();
jest.mock('@pmmmwh/react-refresh-webpack-plugin', () => {
  return jest.fn().mockImplementation(() => {
    return { apply: mockApply };
  });
});

describe('framework-preset-react', () => {
  const reactRefreshPath = require.resolve('react-refresh/babel');
  const webpackConfigMock: webpack.Configuration = {
    plugins: [],
    module: {
      rules: [],
    },
  };
  const babelConfigMock = {};

  const storybookOptions: Partial<StorybookOptions> = {
    configType: 'DEVELOPMENT',
    presets: {
      apply: async () => ({
        fastRefresh: true,
      }),
    },
    presetsList: [],
  };

  const storybookOptionsDisabledRefresh: Partial<StorybookOptions> = {
    configType: 'DEVELOPMENT',
    presets: {
      apply: async () => ({
        fastRefresh: false,
      }),
    },
  };

  describe('babel', () => {
    it('should return a config with fast refresh plugin when fast refresh is enabled', async () => {
      const config = await preset.babel(babelConfigMock, storybookOptions as StorybookOptions);

      expect(config.plugins).toEqual([reactRefreshPath]);
    });

    it('should return unchanged config without fast refresh plugin when fast refresh is disabled', async () => {
      const config = await preset.babel(
        babelConfigMock,
        storybookOptionsDisabledRefresh as StorybookOptions
      );

      expect(config).toEqual(babelConfigMock);
    });

    it('should return unchanged config without fast refresh plugin when mode is not development', async () => {
      const config = await preset.babel(babelConfigMock, {
        ...storybookOptions,
        configType: 'PRODUCTION',
      } as StorybookOptions);

      expect(config).toEqual(babelConfigMock);
    });
  });

  describe('webpackFinal', () => {
    it('should return a config with fast refresh plugin when fast refresh is enabled', async () => {
      const config = await preset.webpackFinal(
        webpackConfigMock,
        storybookOptions as StorybookOptions
      );

      expect(config.plugins).toEqual([new ReactRefreshWebpackPlugin()]);
    });

    it('should return unchanged config without fast refresh plugin when fast refresh is disabled', async () => {
      const config = await preset.webpackFinal(
        webpackConfigMock,
        storybookOptionsDisabledRefresh as StorybookOptions
      );

      expect(config).toEqual(webpackConfigMock);
    });

    it('should return unchanged config without fast refresh plugin when mode is not development', async () => {
      const config = await preset.webpackFinal(webpackConfigMock, {
        ...storybookOptions,
        configType: 'PRODUCTION',
      } as StorybookOptions);

      expect(config).toEqual(webpackConfigMock);
    });
  });
});
