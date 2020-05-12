import fs from 'fs';
import { logger } from '@storybook/node-logger';

interface PresetOptions {
  backgrounds?: any;
  viewport?: any;
}

let packageJson: any = {};
if (fs.existsSync('./package.json')) {
  try {
    packageJson = JSON.parse(fs.readFileSync('./package.json').toString());
  } catch (err) {
    logger.error(`Error reading package.json: ${err.message}`);
  }
}

const isInstalled = (addon: string) => {
  const { dependencies, devDependencies } = packageJson;
  return (dependencies && dependencies[addon]) || (devDependencies && devDependencies[addon]);
};

const makeAddon = (key: string) => `@storybook/addon-${key}`;

const makeAddons = (keys: string[], suffix: string, options: PresetOptions) =>
  keys
    .filter((key) => (options as any)[key] !== false)
    .map((key) => makeAddon(key))
    .filter((addon) => !isInstalled(addon))
    .map((addon) => require.resolve(`${addon}/${suffix}`));

export function addons(options: PresetOptions = {}) {
  const presetAddons = makeAddons(['docs'], 'preset', options);
  const registerAddons = makeAddons(['backgrounds', 'viewport'], 'register', options);
  return [...presetAddons, ...registerAddons];
}
