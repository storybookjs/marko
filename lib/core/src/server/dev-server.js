import path from 'path';
import express, { Router } from 'express';
import webpack from 'webpack';
import { pathExists } from 'fs-extra';

import { stringify } from 'telejson';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { logger } from '@storybook/node-logger';
import { getMiddleware } from './utils/middleware';
import { logConfig } from './logConfig';
import loadConfig from './config';
import loadManagerConfig from './manager/manager-config';
import { getInterpretedFile } from './utils/interpret-files';
import { loadManagerOrAddonsFile } from './utils/load-manager-or-addons-file';
import { resolvePathInStorybookCache } from './utils/resolve-path-in-sb-cache';

const dllPath = path.join(__dirname, '../../dll');

const cache = {};

let previewProcess;
let previewReject;
const bailPreview = (e) => {
  if (previewReject) previewReject();
  if (previewProcess) {
    try {
      previewProcess.close();
      logger.warn('Force closed preview build');
    } catch (err) {
      logger.warn('Unable to close preview build!');
    }
  }
  throw e;
};

const router = new Router();

const canUsePrebuiltManager = async ({ prebuiltDir, configDir }) => {
  const hasPrebuiltManager = await pathExists(path.join(prebuiltDir, 'index.html'));
  if (!hasPrebuiltManager) return false;

  const hasManagerConfig = !!loadManagerOrAddonsFile({ configDir });
  if (hasManagerConfig) return false;

  const mainConfigFile = getInterpretedFile(path.resolve(configDir, 'main'));
  if (!mainConfigFile) return false;

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const { addons, refs, managerBabel, managerWebpack } = require(mainConfigFile);
  if (refs || managerBabel || managerWebpack) return false;
  if (addons && addons.some((addon) => addon !== '@storybook/addon-essentials')) return false;

  return true;
};

const useCachedManager = (cacheDir) => {
  const indexFile = path.join(cacheDir, 'index.html');
  router.use('/', express.static(cacheDir, { index: false }));
  router.get('/', (request, response) => {
    response.set('Content-Type', 'text/html');
    response.sendFile(indexFile);
  });
};

const startManager = async ({ managerConfig, startTime }) => {
  if (!managerConfig) {
    return { managerStats: {}, managerTotalTime: 0 };
  }

  const middleware = webpackDevMiddleware(webpack(managerConfig), {
    publicPath: managerConfig.output.publicPath,
    writeToDisk: true,
    watchOptions: {
      aggregateTimeout: 2000,
      ignored: /node_modules/,
    },
    // this actually causes 0 (regular) output from wdm & webpack
    logLevel: 'warn',
    clientLogLevel: 'warning',
    noInfo: true,
  });

  router.get(/\/static\/media\/.*\..*/, (request, response, next) => {
    response.set('Cache-Control', `public, max-age=31536000`);
    next();
  });

  router.use(middleware);

  const managerStats = await new Promise((resolve) => middleware.waitUntilValid(resolve));
  if (!managerStats) throw new Error('no stats after building preview');
  if (managerStats.hasErrors()) throw managerStats;
  return { managerStats, managerTotalTime: process.hrtime(startTime) };
};

const startPreview = async ({ configType, outputDir, options, startTime }) => {
  if (options.ignorePreview) {
    return { previewStats: {}, previewTotalTime: 0 };
  }

  const previewConfig = await loadConfig({
    configType,
    outputDir,
    cache,
    corePresets: [require.resolve('./preview/preview-preset.js')],
    overridePresets: [require.resolve('./preview/custom-webpack-preset.js')],
    ...options,
  });

  if (options.debugWebpack) {
    logConfig('Preview webpack config', previewConfig, logger);
  }

  const compiler = webpack(previewConfig);
  const { publicPath } = previewConfig.output;

  previewProcess = webpackDevMiddleware(compiler, {
    publicPath: publicPath[0] === '/' ? publicPath.slice(1) : publicPath,
    watchOptions: {
      aggregateTimeout: 1,
      ignored: /node_modules/,
      ...(previewConfig.watchOptions || {}),
    },
    // this actually causes 0 (regular) output from wdm & webpack
    logLevel: 'warn',
    clientLogLevel: 'warning',
    noInfo: true,
    ...previewConfig.devServer,
  });

  router.use(previewProcess);
  router.use(webpackHotMiddleware(compiler));

  const previewStats = await new Promise((resolve, reject) => {
    previewProcess.waitUntilValid(resolve);
    previewReject = reject;
  });
  if (!previewStats) throw new Error('no stats after building preview');
  if (previewStats.hasErrors()) throw previewStats;
  return { previewStats, previewTotalTime: process.hrtime(startTime) };
};

export default async function (options) {
  const configDir = path.resolve(options.configDir);
  const outputDir = options.smokeTest
    ? resolvePathInStorybookCache('public')
    : path.resolve(options.outputDir || resolvePathInStorybookCache('public'));
  const configType = 'DEVELOPMENT';
  const startTime = process.hrtime();

  let usesPrebuiltManager = false;
  if (options.managerCache) {
    const prebuiltDir = path.join(__dirname, '../../prebuilt');
    if (await canUsePrebuiltManager({ prebuiltDir, configDir })) {
      logger.info('=> Using prebuilt manager');
      useCachedManager(prebuiltDir);
      usesPrebuiltManager = true;
    }
  }

  let managerConfig;
  if (!usesPrebuiltManager) {
    managerConfig = await loadManagerConfig({
      configType,
      outputDir,
      configDir,
      cache,
      corePresets: [require.resolve('./manager/manager-preset.js')],
      ...options,
    });

    if (options.debugWebpack) {
      logConfig('Manager webpack config', managerConfig, logger);
    }

    if (options.managerCache) {
      const cachedConfig = await options.cache.get('managerConfig');
      const configString = stringify(managerConfig);
      await options.cache.set('managerConfig', configString);
      if (configString === cachedConfig) {
        logger.info('=> Using cached manager');
        useCachedManager(managerConfig.output.path);
        usesPrebuiltManager = true;
      }
    }
  }

  getMiddleware(configDir)(router);

  // Build the manager and preview in parallel.
  // Bail if the manager fails, but continue if the preview fails.
  return Promise.all([
    startManager({ managerConfig, startTime }).catch(bailPreview),
    startPreview({ configType, outputDir, options, startTime }),
  ]).then(([managerResult, previewResult]) => {
    router.get('/', (request, response) => {
      response.set('Content-Type', 'text/html');
      response.sendFile(path.join(`${outputDir}/index.html`));
    });
    router.get(/\/sb_dll\/(.+\.js)$/, (request, response) => {
      response.set('Content-Type', 'text/javascript');
      response.sendFile(path.join(`${dllPath}/${request.params[0]}`));
    });
    router.get(/\/sb_dll\/(.+\.LICENCE)$/, (request, response) => {
      response.set('Content-Type', 'text/html');
      response.sendFile(path.join(`${dllPath}/${request.params[0]}`));
    });
    return { ...managerResult, ...previewResult, router };
  });
}
