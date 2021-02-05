import { logger } from '@storybook/node-logger';
import express from 'express';
import { pathExists } from 'fs-extra';
import webpack, { Stats } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import { BuilderResult } from './types';
import { useManagerCache, clearManagerCache } from './utils/manager-cache';
import { router } from './dev-server';

export const startManager = async ({ startTime, options, config }: any): Promise<BuilderResult> => {
  if (!config) {
    return {};
  }

  if (options.cache) {
    if (options.managerCache) {
      const [useCache, hasOutput] = await Promise.all([
        // must run even if outputDir doesn't exist, otherwise the 2nd run won't use cache
        useManagerCache(options.cache, config),
        pathExists(options.outputDir),
      ]);
      if (useCache && hasOutput && !options.smokeTest) {
        logger.info('=> Using cached manager');
        return {};
      }
    } else if (!options.smokeTest && (await clearManagerCache(options.cache))) {
      logger.info('=> Cleared cached manager config');
    }
  }

  const compiler = webpack(config);
  const middewareOptions: Parameters<typeof webpackDevMiddleware>[1] = {
    publicPath: config.output?.publicPath as string,
    writeToDisk: true,
  };
  const middleware = webpackDevMiddleware(compiler, middewareOptions);

  router.get(/\/static\/media\/.*\..*/, (request, response, next) => {
    response.set('Cache-Control', `public, max-age=31536000`);
    next();
  });

  // Used to report back any client-side (runtime) errors
  router.post('/runtime-error', express.json(), (request, response) => {
    if (request.body?.error || request.body?.message) {
      logger.error('Runtime error! Check your browser console.');
      logger.error(request.body.error?.stack || request.body.message || request.body);
      if (request.body.origin === 'manager') clearManagerCache(options.cache);
    }
    response.sendStatus(200);
  });

  router.use(middleware);

  const stats: Stats = await new Promise((resolve) => middleware.waitUntilValid(resolve));
  if (!stats) {
    await clearManagerCache(options.cache);
    throw new Error('no stats after building manager');
  }
  if (stats.hasErrors()) {
    await clearManagerCache(options.cache);
    throw stats;
  }
  return { stats, totalTime: process.hrtime(startTime) };
};
