import path from 'path';
import loadPresets from '../presets';
import loadCustomPresets from '../common/custom-presets';

async function getManagerWebpackConfig(options, presets) {
  const babelOptions = await presets.apply('babel', {}, options);
  const refs = await presets.apply('refs', [], options);
  const entries = await presets.apply('managerEntries', [], options);

  if (refs) {
    entries.push(path.resolve(path.join(options.configDir, `generated-refs.js`)));
  }

  return presets.apply('managerWebpack', {}, { ...options, babelOptions, entries, refs });
}

export default async options => {
  const { corePresets = [], frameworkPresets = [], overridePresets = [], ...restOptions } = options;

  const presetsConfig = [
    ...corePresets,
    require.resolve('../common/babel-cache-preset.js'),
    ...frameworkPresets,
    ...loadCustomPresets(options),
    ...overridePresets,
  ];

  const presets = loadPresets(presetsConfig, restOptions);

  return getManagerWebpackConfig({ ...restOptions, presets }, presets);
};
