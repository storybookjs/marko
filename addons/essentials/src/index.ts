import path from 'path';
import { logger } from '@storybook/node-logger';

interface PresetOptions {
  configDir?: string;
  backgrounds?: any;
  viewport?: any;
  docs?: any;
}

const requireMain = (configDir: string) => {
  let main = {};
  const mainFile = path.join(process.cwd(), configDir, 'main');
  try {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    main = require(mainFile);
  } catch (err) {
    logger.warn(`Unable to find main.js: ${mainFile}`);
  }
  return main;
};

export function addons(options: PresetOptions = {}) {
  const checkInstalled = (addon: string, main: any) => {
    const existingAddon = main.addons?.find((entry: string | { name: string }) => {
      const name = typeof entry === 'string' ? entry : entry.name;
      return name?.startsWith(addon);
    });
    if (existingAddon) {
      logger.warn(`Found existing addon ${JSON.stringify(existingAddon)}, skipping.`);
    }
    return !!existingAddon;
  };

  const main = requireMain(options.configDir);
  return ['actions', 'docs', 'controls', 'backgrounds', 'viewport']
    .filter((key) => (options as any)[key] !== false)
    .map((key) => `@storybook/addon-${key}`)
    .filter((addon) => !checkInstalled(addon, main));
}
