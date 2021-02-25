import { Configuration } from 'webpack';
import { loadManagerOrAddonsFile, ManagerWebpackOptions, Options } from '@storybook/core-common';
import createDevConfig from '../manager/manager-webpack.config';

export async function managerWebpack(
  _: Configuration,
  options: Options & ManagerWebpackOptions
): Promise<Configuration> {
  return createDevConfig(options);
}

export async function managerEntries(
  installedAddons: string[],
  options: { managerEntry: string; configDir: string }
): Promise<string[]> {
  const { managerEntry = '@storybook/core-client/dist/esm/manager' } = options;
  const entries = [require.resolve('../globals/polyfills')];

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
