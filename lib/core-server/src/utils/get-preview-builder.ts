import path from 'path';
import { getInterpretedFile, serverRequire, Options } from '@storybook/core-common';

const DEFAULT_WEBPACK = 'webpack4';

export async function getPreviewBuilder(configDir: Options['configDir']) {
  const main = path.resolve(configDir, 'main');
  const mainFile = getInterpretedFile(main);
  const { core } = mainFile ? serverRequire(mainFile) : { core: null };
  const builder = core?.builder || DEFAULT_WEBPACK;
  const builderPackage = ['webpack4', 'webpack5'].includes(builder)
    ? `@storybook/builder-${builder}`
    : builder;

  const previewBuilder = await import(builderPackage);
  return previewBuilder;
}
