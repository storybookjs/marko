import { stringify } from 'telejson';
import webpack from 'webpack';
import { FileSystemCache } from 'file-system-cache';

export const useManagerCache = async (
  fsc: FileSystemCache,
  managerConfig: webpack.Configuration
) => {
  // Drop the `cache` property because it'll change as a result of writing to the cache.
  const { cache: _, ...baseConfig } = managerConfig;
  const configString = stringify(baseConfig);
  const cachedConfig = await fsc.get('managerConfig').catch(() => {});
  await fsc.set('managerConfig', configString);
  return configString === cachedConfig;
};

export const clearManagerCache = async (fsc: FileSystemCache) => {
  if (fsc && fsc.fileExists('managerConfig')) {
    await fsc.remove('managerConfig');
    return true;
  }
  return false;
};
