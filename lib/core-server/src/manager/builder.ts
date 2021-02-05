import webpack, { Stats, Configuration } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import { logger } from '@storybook/node-logger';
import { Builder } from '@storybook/core-common';
import { pathExists } from 'fs-extra';
import express from 'express';
import { getManagerWebpackConfig } from './manager-config';
import { clearManagerCache, useManagerCache } from '../utils/manager-cache';
import { getPrebuiltDir } from '../utils/prebuilt-manager';

let compilation: ReturnType<typeof webpackDevMiddleware>;
let reject: (reason?: any) => void;

type WebpackBuilder = Builder<Configuration>;

export const getConfig: WebpackBuilder['getConfig'] = getManagerWebpackConfig;

export const start: WebpackBuilder['start'] = async ({
  startTime,
  options,
  useProgressReporting,
  router,
}) => {
  const prebuiltDir = await getPrebuiltDir(options);
  const config = await getConfig(options);

  if (options.cache) {
    if (options.managerCache) {
      const [useCache, hasOutput] = await Promise.all([
        // must run even if outputDir doesn't exist, otherwise the 2nd run won't use cache
        useManagerCache(options.cache, config),
        pathExists(options.outputDir),
      ]);
      if (useCache && hasOutput && !options.smokeTest) {
        logger.info('=> Using cached manager');
        // Manager static files
        router.use('/', express.static(prebuiltDir || options.outputDir));

        return { stats: null, totalTime: process.hrtime(startTime), bail };
      }
    } else if (!options.smokeTest && (await clearManagerCache(options.cache))) {
      logger.info('=> Cleared cached manager config');
    }
  }

  const compiler = webpack(config);

  await useProgressReporting(compiler, options, startTime);

  const middlewareOptions: Parameters<typeof webpackDevMiddleware>[1] = {
    publicPath: config.output?.publicPath as string,
    writeToDisk: true,
  };

  compilation = webpackDevMiddleware(compiler, middlewareOptions);

  router.use(compilation);

  const stats = await new Promise<Stats>((ready, stop) => {
    compilation.waitUntilValid(ready);
    reject = stop;
  });

  if (!stats) {
    throw new Error('no stats after building preview');
  }

  if (stats.hasErrors()) {
    throw stats;
  }

  return {
    bail,
    stats,
    totalTime: process.hrtime(startTime),
  };
};

export const bail: WebpackBuilder['bail'] = (e: Error) => {
  if (reject) {
    reject();
  }
  if (process) {
    try {
      compilation.close();
      logger.warn('Force closed preview build');
    } catch (err) {
      logger.warn('Unable to close preview build!');
    }
  }
  throw e;
};

export const build: WebpackBuilder['build'] = async (options) => {
  console.log('TODO');
};

export const corePresets = [require.resolve('./presets/preview-preset.js')];
export const overridePresets = [require.resolve('./presets/custom-webpack-preset.js')];
