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

  return entries;
}
