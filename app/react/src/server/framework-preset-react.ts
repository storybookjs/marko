import path from 'path';
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
const storybookReactDirName = path.dirname(require.resolve('@storybook/react/package.json'));
// TODO: improve node_modules detection
const context = storybookReactDirName.includes('node_modules')
  ? path.join(storybookReactDirName, '../../') // Real life case, already in node_modules
  : path.join(storybookReactDirName, '../../node_modules'); // SB Monorepo

const hasJsxRuntime = () => {
  try {
    require.resolve('react/jsx-runtime', { paths: [context] });
    return true;
  } catch (e) {
    return false;
  }
};

export async function babelDefault(config: TransformOptions) {
  const presetReactOptions = hasJsxRuntime() ? { runtime: 'automatic' } : {};
  return {
    ...config,
    presets: [
      ...config.presets,
      [require.resolve('@babel/preset-react'), presetReactOptions],
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

  logger.info('=> Using React fast refresh');
  return {
    ...config,
    plugins: [...(config.plugins || []), new ReactRefreshWebpackPlugin()],
  };
}
