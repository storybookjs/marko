import { logger } from '@storybook/node-logger';
import { pathExists } from 'fs-extra';
import path from 'path';
import { getAutoRefs } from '../manager/manager-config';
import { getInterpretedFile } from './interpret-files';
import { loadManagerOrAddonsFile } from './load-manager-or-addons-file';
import { serverRequire } from './server-require';

// Addons automatically installed when running `sb init` (see baseGenerator.ts)
export const DEFAULT_ADDONS = ['@storybook/addon-links', '@storybook/addon-essentials'];

// Addons we can safely ignore because they don't affect the manager
export const IGNORED_ADDONS = [
  '@storybook/preset-create-react-app',
  '@storybook/preset-scss',
  '@storybook/preset-typescript',
  ...DEFAULT_ADDONS,
];

export const getPrebuiltDir = async ({ configDir, options }) => {
  if (options.managerCache === false) return false;

  const prebuiltDir = path.join(__dirname, '../../../prebuilt');
  const hasPrebuiltManager = await pathExists(path.join(prebuiltDir, 'index.html'));
  if (!hasPrebuiltManager) return false;

  const hasManagerConfig = !!loadManagerOrAddonsFile({ configDir });
  if (hasManagerConfig) return false;

  const mainConfigFile = getInterpretedFile(path.resolve(configDir, 'main'));
  if (!mainConfigFile) return false;

  const { addons, refs, managerBabel, managerWebpack } = serverRequire(mainConfigFile);
  if (!addons || refs || managerBabel || managerWebpack) return false;
  if (DEFAULT_ADDONS.some((addon) => !addons.includes(addon))) return false;
  if (addons.some((addon) => !IGNORED_ADDONS.includes(addon))) return false;

  // Auto refs will not be listed in the config, so we have to verify there aren't any
  const autoRefs = await getAutoRefs({ configDir });
  if (autoRefs.length > 0) return false;

  logger.info('=> Using prebuilt manager');
  return prebuiltDir;
};
