import path from 'path';
import { logger } from '@storybook/node-logger';

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

  return entries.sort((a, b) => {
    // we want this order to order generated entries so the ones that call configure appear LAST
    // whilst keeping the order of non-generated entries in the order they appear

    switch (true) {
      case !!a.match(/(preview|config).js-generated-config-entry/) &&
        !!b.match(/generated-config-entry/): {
        return 1;
      }
      case !!b.match(/(preview|config).js-generated-config-entry/) &&
        !!a.match(/generated-config-entry/): {
        return -1;
      }
      default: {
        return 0;
      }
    }
  });
}
