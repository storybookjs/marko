import path from 'path';
import { getInterpretedFile, serverRequire, Options } from '@storybook/core-common';

export async function getPreviewBuilder(configDir: Options['configDir']) {
  const main = path.resolve(configDir, 'main');
  const mainFile = getInterpretedFile(main);
  const { core } = mainFile ? serverRequire(mainFile) : { core: null };
  const builder = core?.builder;
  const builderPackage = builder
    ? require.resolve(
        ['webpack4', 'webpack5'].includes(builder) ? `@storybook/builder-${builder}` : builder,
        { paths: [main] }
      )
    : require.resolve('@storybook/builder-webpack4');

  const previewBuilder = await import(builderPackage);
  return previewBuilder;
}
