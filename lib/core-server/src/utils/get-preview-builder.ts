import path from 'path';
import { getInterpretedFile, serverRequire, Options } from '@storybook/core-common';

export async function getPreviewBuilder(configDir: Options['configDir']) {
  const main = path.resolve(configDir, 'main');
  const { core } = serverRequire(getInterpretedFile(main));
  const builder = core?.builder || 'webpack4';

  const previewBuilder = await import(`@storybook/builder-${builder}`);
  return previewBuilder;
}
