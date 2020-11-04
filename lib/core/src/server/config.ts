import { logger } from '@storybook/node-logger';
import { Configuration } from 'webpack';
import loadPresets from './presets';
import loadCustomPresets from './common/custom-presets';
import { typeScriptDefaults } from './config/defaults';
import { PresetConfig, Presets, PresetsOptions, StorybookConfigOptions } from './types';

async function getPreviewWebpackConfig(
  options: StorybookConfigOptions & { presets: Presets },
  presets: Presets
): Promise<Configuration> {
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

export function filterPresetsConfig(presetsConfig: PresetConfig[]): PresetConfig[] {
  return presetsConfig.filter((preset) => {
    const presetName = typeof preset === 'string' ? preset : preset.name;
    return !/@storybook[\\\\/]preset-typescript/.test(presetName);
  });
}
const loadConfig: (
  options: PresetsOptions & StorybookConfigOptions
) => Promise<Configuration> = async (options: PresetsOptions & StorybookConfigOptions) => {
  const { corePresets = [], frameworkPresets = [], overridePresets = [], ...restOptions } = options;

  const presetsConfig: PresetConfig[] = [
    ...corePresets,
    require.resolve('./common/babel-cache-preset'),
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

export default loadConfig;
