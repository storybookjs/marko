import loadCustomBabelConfig from '../utils/load-custom-babel-config';

import babelConfig from './babel';

export const babel = async (_, options) => {
  const { configDir, presets } = options;

  return loadCustomBabelConfig(configDir, () =>
    presets.apply('babelDefault', babelConfig(), options)
  );
};

export const logLevel = (previous, options) => previous || options.loglevel || 'info';
