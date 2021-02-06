import path from 'path';
import { getInterpretedFile, serverRequire, Options } from '@storybook/core-common';

export async function getPreviewBuilder(configDir: Options['configDir']) {
  const { core } = serverRequire(getInterpretedFile(path.resolve(configDir, 'main')));
  const builder = core?.builder || 'webpack4';

  const previewBuilder = await import(`@storybook/builder-${builder}`);
  return previewBuilder;
}
