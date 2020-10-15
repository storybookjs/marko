import path from 'path';
import { logger } from '@storybook/node-logger';
import dedent from 'ts-dedent';

type OptionsEntry = { name: string };
type Entry = string | OptionsEntry;

const findIndex = (addon: string, addons: Entry[]) =>
  addons.findIndex((entry) => {
    const name = (entry as OptionsEntry).name || (entry as string);
    return name && name.startsWith(addon);
  });

const indexOfAddonOrEssentials = (addon: string, addons: Entry[]) => {
  const index = findIndex(addon, addons);
  return index >= 0 ? index : findIndex('@storybook/addon-essentials', addons);
};

export const verifyDocsBeforeControls = (addons: Entry[]) => {
  const docsIndex = indexOfAddonOrEssentials('@storybook/addon-docs', addons);
  const controlsIndex = indexOfAddonOrEssentials('@storybook/addon-controls', addons);
  return controlsIndex >= 0 && docsIndex >= 0 && docsIndex <= controlsIndex;
};

export const ensureDocsBeforeControls = (configDir: string) => {
  const mainFile = path.isAbsolute(configDir)
    ? path.join(configDir, 'main')
    : path.join(process.cwd(), configDir, 'main');

  try {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const main = require(mainFile);
    if (!main?.addons) {
      logger.warn(`Unable to find main.js addons: ${mainFile}`);
      return;
    }
    if (!verifyDocsBeforeControls(main.addons)) {
      logger.warn(dedent`
        Expected '@storybook/addon-docs' to be listed before '@storybook/addon-controls' (or '@storybook/addon-essentials'). Check your main.js?
        
        https://github.com/storybookjs/storybook/issues/11442
      `);
    }
  } catch (err) {
    logger.warn(`Unable to find main.js: ${mainFile}`);
  }
};
