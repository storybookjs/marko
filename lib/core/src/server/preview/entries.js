import path from 'path';
import { logger } from '@storybook/node-logger';

export const sortEntries = entries => {
  const isGenerated = /generated-config-entry/;
  const isGeneratedConfig = /(?:preview|config)\..+-generated-config-entry/;

  const result = entries.slice(0).sort((a, b) => {
    // we want this order to order generated entries so the ones that call configure appear LAST
    // whilst keeping the order of non-generated entries in the order they appear

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

  console.log({ input: entries, output: result });

  return result;
};

export async function createPreviewEntry(options) {
  const { configDir, presets } = options;
  const entries = [
    require.resolve('../common/polyfills'),
    require.resolve('./globals'),
    path.resolve(path.join(configDir, 'storybook-init-framework-entry.js')),
  ];

  const configs = await presets.apply('config', [], options);
  const stories = await presets.apply('stories', [], options);

  if (configs && configs.length) {
    logger.info(`=> Loading config/preview file in "${configDir}".`);
    entries.push(...configs.map(filename => `${filename}-generated-config-entry.js`));
  }

  if (stories && stories.length) {
    logger.info(`=> Adding stories defined in "${path.join(configDir, 'main.js')}".`);
    entries.push(path.resolve(path.join(configDir, `generated-stories-entry.js`)));
  }

  return sortEntries(entries);
}
