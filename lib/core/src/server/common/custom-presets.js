import path from 'path';
import { serverRequire, serverResolve } from '../utils/server-require';
import validateConfigurationFiles from '../utils/validate-configuration-files';

export default function loadCustomPresets({ configDir }) {
  validateConfigurationFiles(configDir);

  const presets = serverRequire(path.resolve(configDir, 'presets'));
  const main = serverRequire(path.resolve(configDir, 'main'));

  if (main) {
    return [serverResolve(path.resolve(configDir, 'main'))];
  }

  return presets || [];
}
