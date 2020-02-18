import path from 'path';
import fetch from 'node-fetch-json';
import { logger } from '@storybook/node-logger';
import { transform } from '@storybook/api/dist/modules/refs';
import loadPresets from '../presets';
import loadCustomPresets from '../common/custom-presets';

async function getManagerWebpackConfig(options, presets) {
  const babelOptions = await presets.apply('babel', {}, options);
  const refs = await presets.apply('refs', undefined, options);
  const entries = await presets.apply('managerEntries', [], options);

  if (refs) {
    const out = await Promise.all(
      Object.entries(refs).map(async ([key, value]) => {
        const url = typeof value === 'string' ? value : value.url;
        const dataUrl = `${url}/data.json`;

        logger.warn(`searching for data of ref: ${key} at: ${dataUrl}`);

        const data = await fetch
          .get(dataUrl)
          .then(r => {
            if (r.error) {
              throw new Error('');
            }

            return r;
          })
          .catch(e => {
            return false;
          });

        refs[key] = {
          id: key,
          url,
          ...(data || {}),
        };

        return [key, !!data, data];
      })
    );

    out.forEach(([key, hasData, data]) => {
      if (!hasData) {
        logger.warn(
          `ref with id: "${key}" did not have data, the frame will be loaded immediately, which is bad for storybook performance`
        );

        refs[key].startInjected = true;
      } else {
        refs[key].startInjected = false;
        refs[key].stories = transform(refs[key].stories, refs[key]);
      }
    });

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
