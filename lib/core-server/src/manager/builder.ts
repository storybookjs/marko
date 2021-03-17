import webpack, { Stats, Configuration, ProgressPlugin } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import { logger } from '@storybook/node-logger';
import { Builder, useProgressReporting, checkWebpackVersion } from '@storybook/core-common';
import { pathExists } from 'fs-extra';
import express from 'express';
import { getManagerWebpackConfig } from './manager-config';
import { clearManagerCache, useManagerCache } from '../utils/manager-cache';
import { getPrebuiltDir } from '../utils/prebuilt-manager';

let compilation: ReturnType<typeof webpackDevMiddleware>;
let reject: (reason?: any) => void;

type WebpackBuilder = Builder<Configuration, Stats>;

const checkWebpackVersion4 = (webpackInstance: { version?: string }) =>
  checkWebpackVersion(webpackInstance, '4.x', 'manager-builder');

export const getConfig: WebpackBuilder['getConfig'] = getManagerWebpackConfig;

export const executor = {
  get: webpack,
};

export const makeStatsFromError = (err: string) =>
  (({
    hasErrors: () => true,
    hasWarnings: () => false,
    toJson: () => ({ warnings: [] as any[], errors: [err] }),
  } as any) as Stats);

export const start: WebpackBuilder['start'] = async ({ startTime, options, router }) => {
  checkWebpackVersion4(executor.get);

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

        return;
      }
    } else if (!options.smokeTest && (await clearManagerCache(options.cache))) {
      logger.info('=> Cleared cached manager config');
    }
  }

  const compiler = executor.get(config);

  if (!compiler) {
    const err = `${config.name}: missing webpack compiler at runtime!`;
    logger.error(err);
    // eslint-disable-next-line consistent-return
    return {
      bail,
      totalTime: process.hrtime(startTime),
      stats: makeStatsFromError(err),
    };
  }

  const { handler, modulesCount } = await useProgressReporting(router, startTime, options);
  new ProgressPlugin({ handler, modulesCount }).apply(compiler);

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

  // eslint-disable-next-line consistent-return
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

export const build: WebpackBuilder['build'] = async ({ options, startTime }) => {
  logger.info('=> Compiling manager..');
  checkWebpackVersion4(executor.get);

  const config = await getConfig(options);
  const statsOptions = typeof config.stats === 'boolean' ? 'minimal' : config.stats;

  const compiler = executor.get(config);
  if (!compiler) {
    const err = `${config.name}: missing webpack compiler at runtime!`;
    logger.error(err);
    return Promise.resolve(makeStatsFromError(err));
  }

  return new Promise((succeed, fail) => {
    compiler.run((error, stats) => {
      if (error || !stats || stats.hasErrors()) {
        logger.error('=> Failed to build the manager');

        if (error) {
          logger.error(error.message);
        }

        if (stats && (stats.hasErrors() || stats.hasWarnings())) {
          const { warnings, errors } = stats.toJson(statsOptions);

          errors.forEach((e) => logger.error(e));
          warnings.forEach((e) => logger.error(e));
        }

        process.exitCode = 1;
        fail(error || stats);
      } else {
        logger.trace({ message: '=> Manager built', time: process.hrtime(startTime) });
        const statsData = stats.toJson(
          typeof statsOptions === 'string' ? statsOptions : { ...statsOptions, warnings: true }
        );
        statsData?.warnings?.forEach((e) => logger.warn(e));

        succeed(stats);
      }
    });
  });
};

export const corePresets: WebpackBuilder['corePresets'] = [];
export const overridePresets: WebpackBuilder['overridePresets'] = [];
