import loadCustomBabelConfig from '../utils/load-custom-babel-config';

import { babelConfig } from './babel';

export const babel = async (_: unknown, options: { configDir: string; presets: any }) => {
  const { configDir, presets } = options;

  return loadCustomBabelConfig(configDir, () =>
    presets.apply('babelDefault', babelConfig(), options)
  );
};

export const logLevel = (previous: any, options: { loglevel: any }) =>
  previous || options.loglevel || 'info';
