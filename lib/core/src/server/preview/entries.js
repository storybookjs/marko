import path from 'path';
import { logger } from '@storybook/node-logger';
import stable from 'stable';
import dedent from 'ts-dedent';
import glob from 'glob-promise';
import { loadPreviewOrConfigFile } from '../utils/load-preview-or-config-file';

export const sortEntries = (entries) => {
  const isGenerated = /generated-(config|other)-entry/;
  const isGeneratedConfig = /(?:preview|config)\..+-generated-config-entry/;

  return stable(entries.slice(0), (a, b) => {
    // We need to ensure that all parameters and decorators that are added by preview entrypoints added by addons happen before any configure() calls executed by the user's preview.js (or config.js), or by main.js:stories.
    // As those addons will create generated entries, this means we need to ensure all generated entries come before all other entries (generated or otherwise).

    switch (true) {
      case !!a.match(isGeneratedConfig) && !!b.match(isGenerated): {
        return 1;
      }
      case !!b.match(isGeneratedConfig) && !!a.match(isGenerated): {
        return -1;
      }
      default: {
        return 0;
      }
    }
  });
};

const getMainConfigs = (options) => {
  const previewPath = loadPreviewOrConfigFile(options);
  return previewPath ? [previewPath] : [];
};

export async function createPreviewEntry(options) {
  const { configDir, presets } = options;
  const entries = [
    require.resolve('../common/polyfills'),
    require.resolve('./globals'),
    path.resolve(path.join(configDir, 'storybook-init-framework-entry.js')),
  ];

  const configs = getMainConfigs(options);
  const other = await presets.apply('config', [], options);
  const stories = await presets.apply('stories', [], options);

  if (configs.length > 0) {
    const noun = configs.length === 1 ? 'file' : 'files';
    logger.info(`=> Loading ${configs.length} config ${noun} in "${configDir}"`);
    entries.push(...configs.map((filename) => `${filename}-generated-config-entry.js`));
  }

  if (other && other.length > 0) {
    const noun = other.length === 1 ? 'file' : 'files';
    logger.info(`=> Loading ${other.length} other ${noun} in "${configDir}"`);
    entries.push(...other.map((filename) => `${filename}-generated-other-entry.js`));
  }

  if (stories && stories.length) {
    entries.push(path.resolve(path.join(configDir, `generated-stories-entry.js`)));

    const files = (
      await Promise.all(stories.map((g) => glob(path.isAbsolute(g) ? g : path.join(configDir, g))))
    ).reduce((a, b) => a.concat(b));

    if (files.length === 0) {
      logger.warn(dedent`
        We found no files matching any of the following globs:
        
        ${stories.join('\n')}

        Maybe your glob was invalid?
        see: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#correct-globs-in-mainjs
      `);
    } else {
      logger.info(`=> Adding stories defined in "${path.join(configDir, 'main.js')}"`);
    }
  }

  return sortEntries(entries);
}
