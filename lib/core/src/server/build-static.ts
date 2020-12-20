import chalk from 'chalk';
import cpy from 'cpy';
import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';

import { logger } from '@storybook/node-logger';

import { getProdCli } from './cli';
import loadConfig from './config';
import loadManagerConfig from './manager/manager-config';
import { logConfig } from './logConfig';
import { getPrebuiltDir } from './utils/prebuilt-manager';
import { parseStaticDir } from './utils/static-files';

async function compileManager(managerConfig: any, managerStartTime: [number, number]) {
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

          errors.forEach((e) => logger.error(e));
          warnings.forEach((e) => logger.error(e));
        }

        process.exitCode = 1;
        reject(error || stats);
        return;
      }

      logger.trace({ message: '=> Manager built', time: process.hrtime(managerStartTime) });
      stats.toJson(managerConfig.stats).warnings.forEach((e) => logger.warn(e));

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

async function compilePreview(previewConfig: any, previewStartTime: [number, number]) {
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

          errors.forEach((e) => logger.error(e));
          warnings.forEach((e) => logger.error(e));
          return reject(stats);
        }
      }

      logger.trace({ message: '=> Preview built', time: process.hrtime(previewStartTime) });
      if (stats) {
        stats.toJson(previewConfig.stats).warnings.forEach((e) => logger.warn(e));
      }

      return resolve(stats);
    });
  });
}

async function copyAllStaticFiles(staticDirs: any[] | undefined, outputDir: string) {
  if (staticDirs && staticDirs.length > 0) {
    await Promise.all(
      staticDirs.map(async (dir) => {
        try {
          const { staticDir, staticPath, targetDir } = await parseStaticDir(dir);
          const targetPath = path.join(outputDir, targetDir);
          logger.info(chalk`=> Copying static files: {cyan ${staticDir}} => {cyan ${targetDir}}`);

          // Storybook's own files should not be overwritten, so we skip such files if we find them
          const skipPaths = ['index.html', 'iframe.html'].map((f) => path.join(targetPath, f));
          await fs.copy(staticPath, targetPath, { filter: (_, dest) => !skipPaths.includes(dest) });
        } catch (e) {
          logger.error(e.message);
          process.exit(-1);
        }
      })
    );
  }
}

async function buildManager(configType: any, outputDir: string, configDir: string, options: any) {
  logger.info('=> Building manager..');
  const managerStartTime = process.hrtime();

  logger.info('=> Loading manager config..');
  const managerConfig = await loadManagerConfig({
    ...options,
    configType,
    outputDir,
    configDir,
    corePresets: [require.resolve('./manager/manager-preset.js')],
  });

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
  const previewConfig = await loadConfig({
    ...options,
    configType,
    outputDir,
    packageJson,
    corePresets: [require.resolve('./preview/preview-preset.js')],
    overridePresets: [require.resolve('./preview/custom-webpack-preset.js')],
  });

  if (debugWebpack) {
    logConfig('Preview webpack config', previewConfig);
  }

  if (watch) {
    return watchPreview(previewConfig);
  }

  return compilePreview(previewConfig, previewStartTime);
}

export async function buildStaticStandalone(options: any) {
  const { staticDir, configDir, packageJson } = options;

  const configType = 'PRODUCTION';
  const outputDir = path.isAbsolute(options.outputDir)
    ? options.outputDir
    : path.join(process.cwd(), options.outputDir);

  const defaultFavIcon = require.resolve('./public/favicon.ico');

  logger.info(chalk`=> Cleaning outputDir: {cyan ${outputDir}}`);
  if (outputDir === '/') throw new Error("Won't remove directory '/'. Check your outputDir!");
  await fs.remove(outputDir);

  await cpy(defaultFavIcon, outputDir);
  await copyAllStaticFiles(staticDir, outputDir);

  const prebuiltDir = await getPrebuiltDir({ configDir, options });
  if (prebuiltDir) {
    await cpy('**', outputDir, { cwd: prebuiltDir, parents: true });
  } else {
    await buildManager(configType, outputDir, configDir, options);
  }

  if (options.managerOnly) {
    logger.info(`=> Not building preview`);
  } else {
    await buildPreview(configType, outputDir, packageJson, options);
  }

  logger.info(`=> Output directory: ${outputDir}`);
}

export function buildStatic({ packageJson, ...loadOptions }: any) {
  const cliOptions = getProdCli(packageJson);

  return buildStaticStandalone({
    ...cliOptions,
    ...loadOptions,
    packageJson,
    configDir: loadOptions.configDir || cliOptions.configDir || './.storybook',
    outputDir: loadOptions.outputDir || cliOptions.outputDir || './storybook-static',
    ignorePreview: !!cliOptions.previewUrl,
    docsMode: !!cliOptions.docs,
  }).catch((e) => {
    logger.error(e);
    process.exit(1);
  });
}
