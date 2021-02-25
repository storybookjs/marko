import path from 'path';
import { serverRequire, serverResolve } from './interpret-require';
import { validateConfigurationFiles } from './validate-configuration-files';
import { PresetConfig } from '../types';

export function loadCustomPresets({ configDir }: { configDir: string }): PresetConfig[] {
  validateConfigurationFiles(configDir);

  const presets = serverRequire(path.resolve(configDir, 'presets'));
  const main = serverRequire(path.resolve(configDir, 'main'));

  if (main) {
    return [serverResolve(path.resolve(configDir, 'main'))];
  }

  return presets || [];
}
