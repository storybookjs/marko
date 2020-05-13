import path from 'path';
import fs from 'fs-extra';
import findUp from 'find-up';
import resolveFrom from 'resolve-from';

import loadPresets from '../presets';
import loadCustomPresets from '../common/custom-presets';

const getAutoRefs = async (options) => {
  const location = await findUp('package.json', { cwd: options.configDir });
  const directory = path.dirname(location);

  const { dependencies, devDependencies } = await fs.readJSON(location);

  const list = await Promise.all(
    Object.keys({ ...dependencies, ...devDependencies }).map(async (d) => {
      const l = resolveFrom(directory, path.join(d, 'package.json'));

      const { storybook, name } = await fs.readJSON(l);

      if (storybook?.url) {
        return { id: name, ...storybook };
      }
      return undefined;
    })
  );

  return list.filter(Boolean);
};

const toTitle = (input) => {
  const result = input
    .replace(/[A-Z]/g, (f) => ` ${f}`)
    .replace(/[-_][A-Z]/gi, (f) => ` ${f.toUppercase()}`)
    .replace('-', ' ')
    .replace('_', ' ');

  return `${result.substring(0, 1).toUpperCase()}${result.substring(1)}`.trim();
};

async function getManagerWebpackConfig(options, presets) {
  const babelOptions = await presets.apply('babel', {}, options);

  const autoRefs = await getAutoRefs(options);
  const refs = await presets.apply('refs', undefined, options);
  const entries = await presets.apply('managerEntries', [], options);

  if (refs) {
    autoRefs.forEach(({ id, url, title }) => {
      refs[id] = {
        id,
        url,
        title,
      };
    });

    Object.entries(refs).forEach(([key, value]) => {
      const url = typeof value === 'string' ? value : value.url;
      const title = typeof value === 'string' ? toTitle(key) : value.title || toTitle(value.key);

      refs[key] = {
        id: key,
        title,
        url,
      };
    });

    entries.push(path.resolve(path.join(options.configDir, `generated-refs.js`)));
  }

  return presets.apply('managerWebpack', {}, { ...options, babelOptions, entries, refs });
}

export default async (options) => {
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
