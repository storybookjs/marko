import fs from 'fs';
import path from 'path';
import { logger } from '@storybook/node-logger';
import { Options } from 'ts-loader';

function resolveTsConfig(tsConfigPath: string): string | undefined {
  if (fs.existsSync(tsConfigPath)) {
    logger.info('=> Found custom tsconfig.json');
    return tsConfigPath;
  }
  return undefined;
}

export default function (configDir: string) {
  const tsLoaderOptions: Partial<Options> = {
    transpileOnly: true,
    compilerOptions: {
      emitDecoratorMetadata: true,
    },
  };

  const configFilePath = resolveTsConfig(path.resolve(configDir, 'tsconfig.json'));
  if (configFilePath) tsLoaderOptions.configFile = configFilePath;

  return tsLoaderOptions;
}
