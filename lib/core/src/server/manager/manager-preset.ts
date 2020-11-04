import { Configuration } from 'webpack';
import { loadManagerOrAddonsFile } from '../utils/load-manager-or-addons-file';
import createDevConfig from './manager-webpack.config';
import { ManagerWebpackOptions } from '../types';

export async function managerWebpack(
  _: Configuration,
  options: ManagerWebpackOptions
): Promise<Configuration> {
  return createDevConfig(options);
}

export async function managerEntries(
  installedAddons: string[],
  options: { managerEntry: string; configDir: string }
): Promise<string[]> {
  const { managerEntry = '../../client/manager' } = options;
  const entries = [require.resolve('../common/polyfills')];

  if (installedAddons && installedAddons.length) {
    entries.push(...installedAddons);
  }

  const managerConfig = loadManagerOrAddonsFile(options);
  if (managerConfig) {
    entries.push(managerConfig);
  }

  entries.push(require.resolve(managerEntry));
  return entries;
}

export * from '../common/common-preset';
