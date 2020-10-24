import path from 'path';
import { TransformOptions } from '@babel/core';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import type { Configuration } from 'webpack';

import semver from '@storybook/semver';
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

export async function babelDefault(config: TransformOptions) {
  let reactVersion;
  try {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const reactPkg = require(require.resolve('react/package.json', { paths: [context] }));
    reactVersion = reactPkg.version;
  } catch {
    logger.warn('Unable to determine react version');
  }
  const presetReactOptions =
    reactVersion && semver.gte(reactVersion, '16.14.0') ? { runtime: 'automatic' } : {};
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

  logger.info('=> Using React fast refresh feature.');
  return {
    ...config,
    plugins: [...(config.plugins || []), new ReactRefreshWebpackPlugin()],
  };
}
