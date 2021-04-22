import chalk from 'chalk';
import cpy from 'cpy';
import fs from 'fs-extra';
import path from 'path';

import { logger } from '@storybook/node-logger';

import {
  loadAllPresets,
  LoadOptions,
  CLIOptions,
  BuilderOptions,
  Options,
  Builder,
} from '@storybook/core-common';
import * as managerBuilder from './manager/builder';

import { getProdCli } from './cli';
import { outputStats } from './utils/output-stats';
import { getPrebuiltDir } from './utils/prebuilt-manager';
import { cache } from './utils/cache';
import { copyAllStaticFiles } from './utils/copy-all-static-files';
import { getPreviewBuilder } from './utils/get-preview-builder';

export async function buildStaticStandalone(options: CLIOptions & LoadOptions & BuilderOptions) {
  /* eslint-disable no-param-reassign */
  options.configType = 'PRODUCTION';

  if (options.outputDir === '') {
    throw new Error("Won't remove current directory. Check your outputDir!");
  }

  if (options.staticDir?.includes('/')) {
    throw new Error("Won't copy root directory. Check your staticDirs!");
  }

  options.outputDir = path.isAbsolute(options.outputDir)
    ? options.outputDir
    : path.join(process.cwd(), options.outputDir);
  options.configDir = path.resolve(options.configDir);
  /* eslint-enable no-param-reassign */

  const defaultFavIcon = require.resolve('./public/favicon.ico');

  logger.info(chalk`=> Cleaning outputDir: {cyan ${options.outputDir}}`);
  if (options.outputDir === '/') {
    throw new Error("Won't remove directory '/'. Check your outputDir!");
  }
  await fs.emptyDir(options.outputDir);

  await cpy(defaultFavIcon, options.outputDir);
  await copyAllStaticFiles(options.staticDir, options.outputDir);

  const previewBuilder: Builder<unknown, unknown> = await getPreviewBuilder(options.configDir);

  const presets = loadAllPresets({
    corePresets: [
      require.resolve('./presets/common-preset'),
      require.resolve('./presets/manager-preset'),
      ...previewBuilder.corePresets,
      require.resolve('./presets/babel-cache-preset'),
    ],
    overridePresets: previewBuilder.overridePresets,
    ...options,
  });

  const fullOptions: Options = {
    ...options,
    presets,
  };

  const prebuiltDir = await getPrebuiltDir(fullOptions);

  const startTime = process.hrtime();
  const manager = prebuiltDir
    ? cpy('**', options.outputDir, { cwd: prebuiltDir, parents: true }).then(() => {})
    : managerBuilder.build({
        startTime,
        options: fullOptions,
      });

  if (options.ignorePreview) {
    logger.info(`=> Not building preview`);
  }

  const preview = options.ignorePreview
    ? Promise.resolve()
    : previewBuilder.build({
        startTime,
        options: fullOptions,
      });

  const [managerStats, previewStats] = await Promise.all([manager, preview]);

  if (options.webpackStatsJson) {
    const target = options.webpackStatsJson === true ? options.outputDir : options.webpackStatsJson;
    await outputStats(target, previewStats, managerStats);
  }

  logger.info(`=> Output directory: ${options.outputDir}`);
}

export async function buildStatic({ packageJson, ...loadOptions }: LoadOptions) {
  const cliOptions = getProdCli(packageJson);

  try {
    await buildStaticStandalone({
      ...cliOptions,
      ...loadOptions,
      packageJson,
      configDir: loadOptions.configDir || cliOptions.configDir || './.storybook',
      outputDir: loadOptions.outputDir || cliOptions.outputDir || './storybook-static',
      ignorePreview: !!loadOptions.ignorePreview || !!cliOptions.previewUrl,
      docsMode: !!cliOptions.docs,
      configType: 'PRODUCTION',
      cache,
    });
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
}
