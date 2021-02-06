import chalk from 'chalk';
import cpy from 'cpy';
import fs from 'fs-extra';
import path from 'path';
import webpack, { Configuration } from 'webpack';

import { logger } from '@storybook/node-logger';

import {
  logConfig,
  getInterpretedFile,
  serverRequire,
  loadAllPresets,
  LoadOptions,
  CLIOptions,
  RenamedOptions,
} from '@storybook/core-common';
import * as managerBuilder from './manager/builder';

import { getProdCli } from './cli';
import { getPrebuiltDir } from './utils/prebuilt-manager';
import { useProgressReporting } from './utils/progress-reporting';
import { cache } from './utils/cache';
import { copyAllStaticFiles } from './utils/copy-all-static-files';

async function compileManager(managerConfig: Configuration, managerStartTime: [number, number]) {
  logger.info('=> Compiling manager..');

  return new Promise((resolve, reject) => {
    webpack(managerConfig).run((error, stats) => {
      if (error || !stats || stats.hasErrors()) {
        logger.error('=> Failed to build the manager');

        if (error) {
          logger.error(error.message);
        }

        if (stats && (stats.hasErrors() || stats.hasWarnings())) {
          const { warnings, errors } = stats.toJson(managerConfig.stats);

          errors.forEach((e: string) => logger.error(e));
          warnings.forEach((e: string) => logger.error(e));
        }

        process.exitCode = 1;
        reject(error || stats);
        return;
      }

      logger.trace({ message: '=> Manager built', time: process.hrtime(managerStartTime) });
      stats.toJson(managerConfig.stats).warnings.forEach((e: string) => logger.warn(e));

      resolve(stats);
    });
  });
}

async function watchPreview(previewConfig: any) {
  logger.info('=> Compiling preview in watch mode..');

  return new Promise(() => {
    webpack(previewConfig).watch(
      {
        aggregateTimeout: 1,
      },
      (error, stats) => {
        if (!error) {
          const statsConfig = previewConfig.stats ? previewConfig.stats : { colors: true };

          // eslint-disable-next-line no-console
          console.log(stats.toString(statsConfig));
        } else {
          logger.error(error.message);
        }
      }
    );
  });
}

async function compilePreview(previewConfig: Configuration, previewStartTime: [number, number]) {
  logger.info('=> Compiling preview..');

  return new Promise((resolve, reject) => {
    webpack(previewConfig).run((error, stats) => {
      if (error || !stats || stats.hasErrors()) {
        logger.error('=> Failed to build the preview');
        process.exitCode = 1;

        if (error) {
          logger.error(error.message);
          return reject(error);
        }

        if (stats && (stats.hasErrors() || stats.hasWarnings())) {
          const { warnings, errors } = stats.toJson(previewConfig.stats);

          errors.forEach((e: string) => logger.error(e));
          warnings.forEach((e: string) => logger.error(e));
          return reject(stats);
        }
      }

      logger.trace({ message: '=> Preview built', time: process.hrtime(previewStartTime) });
      if (stats) {
        stats.toJson(previewConfig.stats).warnings.forEach((e: string) => logger.warn(e));
      }

      return resolve(stats);
    });
  });
}

async function buildManager(configType: any, outputDir: string, configDir: string, options: any) {
  logger.info('=> Building manager..');
  const managerStartTime = process.hrtime();

  logger.info('=> Loading manager config..');
  const managerConfig = null as any;
  //  await loadManagerConfig({
  //   ...options,
  //   configType,
  //   outputDir,
  //   configDir,
  //   corePresets: [require.resolve('./presets/manager-preset.js')],
  // });

  if (options.debugWebpack) {
    logConfig('Manager webpack config', managerConfig);
  }

  return compileManager(managerConfig, managerStartTime);
}

async function buildPreview(configType: any, outputDir: string, packageJson: any, options: any) {
  const { watch, debugWebpack } = options;

  logger.info('=> Building preview..');
  const previewStartTime = process.hrtime();

  logger.info('=> Loading preview config..');
  const previewConfig = null as any;
  // await loadConfig({
  //   ...options,
  //   configType,
  //   outputDir,
  //   packageJson,
  //   corePresets: [require.resolve('./presets/preview-preset.js')],
  //   overridePresets: [require.resolve('./presets/custom-webpack-preset.js')],
  // });

  if (debugWebpack) {
    logConfig('Preview webpack config', previewConfig);
  }

  if (watch) {
    return watchPreview(previewConfig);
  }

  return compilePreview(previewConfig, previewStartTime);
}

export async function buildStaticStandalone(options: CLIOptions & LoadOptions & RenamedOptions) {
  const { staticDir, configDir, packageJson } = options;

  /* eslint-disable no-param-reassign */
  options.outputDir = path.isAbsolute(options.outputDir)
    ? options.outputDir
    : path.join(process.cwd(), options.outputDir);
  /* eslint-enable no-param-reassign */

  const defaultFavIcon = require.resolve('./public/favicon.ico');

  logger.info(chalk`=> Cleaning outputDir: {cyan ${options.outputDir}}`);
  if (options.outputDir === '/') {
    throw new Error("Won't remove directory '/'. Check your outputDir!");
  }
  await fs.emptyDir(options.outputDir);

  await cpy(defaultFavIcon, options.outputDir);
  await copyAllStaticFiles(staticDir, options.outputDir);

  const { core } = serverRequire(getInterpretedFile(path.resolve(configDir, 'main')));
  const builder = core?.builder || 'webpack4';

  const previewBuilder = await import(`@storybook/builder-${builder}`);

  const presets = loadAllPresets({
    corePresets: [
      require.resolve('./presets/common-preset.js'),
      require.resolve('./presets/manager-preset.js'),
      ...previewBuilder.corePresets,
      require.resolve('./presets/babel-cache-preset'),
    ],
    overridePresets: previewBuilder.overridePresets,
    ...options,
  });

  const fullOptions = {
    ...options,
    presets,
  };

  const prebuiltDir = await getPrebuiltDir(options);
  if (prebuiltDir) {
    await cpy('**', options.outputDir, { cwd: prebuiltDir, parents: true });
  } else {
    const startTime = process.hrtime();
    await managerBuilder.build({
      startTime,
      options: fullOptions,
      useProgressReporting,
    });
  }

  if (options.managerOnly) {
    logger.info(`=> Not building preview`);
  } else {
    const startTime = process.hrtime();

    await previewBuilder.build({
      startTime,
      options: fullOptions,
      useProgressReporting,
    });
  }

  logger.info(`=> Output directory: ${options.outputDir}`);
}

export async function buildStatic({ packageJson, ...loadOptions }: LoadOptions) {
  const cliOptions = await getProdCli(packageJson);

  return buildStaticStandalone({
    ...cliOptions,
    ...loadOptions,
    packageJson,
    configDir: cliOptions.configDir || './.storybook',
    outputDir: loadOptions.outputDir || cliOptions.outputDir || './storybook-static',
    ignorePreview: !!cliOptions.previewUrl,
    docsMode: !!cliOptions.docs,
    configType: 'PRODUCTION',
    cache,
  }).catch((e) => {
    logger.error(e);
    process.exit(1);
  });
}
