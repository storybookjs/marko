import path from 'path';
import fs from 'fs-extra';
import findUp from 'find-up';
import resolveFrom from 'resolve-from';

import { logger } from '@storybook/node-logger';

import loadPresets from '../presets';
import loadCustomPresets from '../common/custom-presets';
import { typeScriptDefaults } from '../config/defaults';

const getAutoRefs = async (options) => {
  const location = await findUp('package.json', { cwd: options.configDir });
  const directory = path.dirname(location);

  const { dependencies, devDependencies } = await fs.readJSON(location);

  const list = await Promise.all(
    Object.keys({ ...dependencies, ...devDependencies }).map(async (d) => {
      try {
        const l = resolveFrom(directory, path.join(d, 'package.json'));

        const { storybook, name } = await fs.readJSON(l);

        if (storybook?.url) {
          return { id: name, ...storybook };
        }
      } catch {
        logger.warn(`unable to find package.json for ${d}`);
        return undefined;
      }
      return undefined;
    })
  );

  return list.filter(Boolean);
};

const stripTrailingSlash = (url) => url.replace(/\/$/, '');

const toTitle = (input) => {
  const result = input
    .replace(/[A-Z]/g, (f) => ` ${f}`)
    .replace(/[-_][A-Z]/gi, (f) => ` ${f.toUppercase()}`)
    .replace('-', ' ')
    .replace('_', ' ');

  return `${result.substring(0, 1).toUpperCase()}${result.substring(1)}`.trim();
};

async function getManagerWebpackConfig(options, presets) {
  const typescriptOptions = await presets.apply('typescript', { ...typeScriptDefaults }, options);
  const babelOptions = await presets.apply('babel', {}, { ...options, typescriptOptions });

  const autoRefs = await getAutoRefs(options);
  const definedRefs = await presets.apply('refs', undefined, options);
  const entries = await presets.apply('managerEntries', [], options);

  const refs = {};

  if (autoRefs && autoRefs.length) {
    autoRefs.forEach(({ id, url, title }) => {
      refs[id] = {
        id,
        url: stripTrailingSlash(url),
        title,
      };
    });
  }

  if (definedRefs) {
    Object.entries(definedRefs).forEach(([key, value]) => {
      if (value?.disabled) {
        delete refs[key];
        return;
      }

      const url = typeof value === 'string' ? value : value.url;
      const rest =
        typeof value === 'string'
          ? { title: toTitle(key) }
          : { ...value, title: value.title || toTitle(value.key) };

      refs[key] = {
        id: key,
        ...rest,
        url: stripTrailingSlash(url),
      };
    });
  }
  if (autoRefs || definedRefs) {
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
