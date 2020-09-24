import { logger } from '@storybook/node-logger';
import loadPresets from './presets';
import loadCustomPresets from './common/custom-presets';
import { typeScriptDefaults } from './config/defaults';

async function getPreviewWebpackConfig(options, presets) {
  const typescriptOptions = await presets.apply('typescript', { ...typeScriptDefaults }, options);
  const babelOptions = await presets.apply('babel', {}, { ...options, typescriptOptions });
  const entries = await presets.apply('entries', [], options);
  const stories = await presets.apply('stories', [], options);
  const frameworkOptions = await presets.apply(`${options.framework}Options`, {}, options);

  return presets.apply(
    'webpack',
    {},
    {
      ...options,
      babelOptions,
      entries,
      stories,
      typescriptOptions,
      [`${options.framework}Options`]: frameworkOptions,
    }
  );
}

export const filterPresetsConfig = (presetsConfig) =>
  presetsConfig.filter(
    (preset) => !/@storybook[\\\\/]preset-typescript/.test(preset.name || preset)
  );

export default async (options) => {
  const { corePresets = [], frameworkPresets = [], overridePresets = [], ...restOptions } = options;

  const presetsConfig = [
    ...corePresets,
    require.resolve('./common/babel-cache-preset.js'),
    ...frameworkPresets,
    ...loadCustomPresets(options),
    ...overridePresets,
  ];

  // Remove `@storybook/preset-typescript` and add a warning if in use.
  const filteredPresetConfig = filterPresetsConfig(presetsConfig);
  if (filteredPresetConfig.length < presetsConfig.length) {
    logger.warn(
      'Storybook now supports TypeScript natively. You can safely remove `@storybook/preset-typescript`.'
    );
  }

  const presets = loadPresets(filteredPresetConfig, restOptions);

  return getPreviewWebpackConfig({ ...restOptions, presets }, presets);
};
