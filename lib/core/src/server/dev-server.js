import { logger } from '@storybook/node-logger';
import open from 'better-opn';
import express, { Router } from 'express';
import { pathExists, readFile } from 'fs-extra';
import http from 'http';
import https from 'https';
import ip from 'ip';
import path from 'path';
import prettyTime from 'pretty-hrtime';
import { stringify } from 'telejson';
import dedent from 'ts-dedent';
import favicon from 'serve-favicon';
import webpack, { ProgressPlugin } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { getMiddleware } from './utils/middleware';
import { logConfig } from './logConfig';
import loadConfig from './config';
import loadManagerConfig from './manager/manager-config';
import { getInterpretedFile } from './utils/interpret-files';
import { loadManagerOrAddonsFile } from './utils/load-manager-or-addons-file';
import { resolvePathInStorybookCache } from './utils/resolve-path-in-sb-cache';

const defaultFavIcon = require.resolve('./public/favicon.ico');
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

async function getServer(app, options) {
  if (!options.https) {
    return http.createServer(app);
  }

  if (!options.sslCert) {
    logger.error('Error: --ssl-cert is required with --https');
    process.exit(-1);
  }

  if (!options.sslKey) {
    logger.error('Error: --ssl-key is required with --https');
    process.exit(-1);
  }

  const sslOptions = {
    ca: await Promise.all((options.sslCa || []).map((ca) => readFile(ca, 'utf-8'))),
    cert: await readFile(options.sslCert, 'utf-8'),
    key: await readFile(options.sslKey, 'utf-8'),
  };

  return https.createServer(sslOptions, app);
}

async function useStatics(app, options) {
  const { staticDir } = options;

  let hasCustomFavicon = false;

  if (staticDir && staticDir.length) {
    await Promise.all(
      staticDir.map(async (dir) => {
        const [currentStaticDir, staticEndpoint] = dir.split(':').concat('/');
        const localStaticPath = path.resolve(currentStaticDir);

        if (!(await pathExists(localStaticPath))) {
          logger.error(`Error: no such directory to load static files: ${localStaticPath}`);
          process.exit(-1);
        }

        logger.info(
          `=> Loading static files from: ${localStaticPath} and serving at ${staticEndpoint} .`
        );
        app.use(staticEndpoint, express.static(localStaticPath, { index: false }));

        const faviconPath = path.resolve(localStaticPath, 'favicon.ico');

        if (await pathExists(faviconPath)) {
          hasCustomFavicon = true;
          app.use(favicon(faviconPath));
        }
      })
    );
  }

  if (!hasCustomFavicon) {
    app.use(favicon(defaultFavIcon));
  }
}

function openInBrowser(address) {
  try {
    open(address);
  } catch (error) {
    logger.error(dedent`
      Could not open ${address} inside a browser. If you're running this command inside a
      docker container or on a CI, you need to pass the '--ci' flag to prevent opening a
      browser by default.
    `);
  }
}

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

const printDuration = (startTime) =>
  prettyTime(process.hrtime(startTime))
    .replace(' ms', ' milliseconds')
    .replace(' s', ' seconds')
    .replace(' m', ' minutes');

const useProgressReporting = async (compiler, options, startTime) => {
  let value = 0;
  let totalModules;
  let reportProgress = () => {};

  router.get('/progress', (request, response) => {
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Connection', 'keep-alive');
    response.flushHeaders();

    const close = () => response.end();
    response.on('close', close);

    reportProgress = (progress) => {
      if (response.writableEnded) return;
      response.write(`data: ${JSON.stringify(progress)}\n\n`);
      if (progress.value === 1) close();
    };
  });

  const handler = (newValue, message, arg3) => {
    value = Math.max(newValue, value); // never go backwards
    const progress = { value, message: message.charAt(0).toUpperCase() + message.slice(1) };
    if (message === 'building') {
      const counts = arg3.match(/(\d+)\/(\d+)/) || [];
      const complete = parseInt(counts[1], 10);
      const total = parseInt(counts[2], 10);
      if (!Number.isNaN(complete) && !Number.isNaN(total)) {
        progress.modules = { complete, total };
        totalModules = total;
      }
    }
    if (value === 1) {
      options.cache.set('modulesCount', totalModules);
      if (!progress.message) {
        progress.message = `Completed in ${printDuration(startTime)}.`;
      }
    }
    reportProgress(progress);
  };

  const modulesCount = (await options.cache.get('modulesCount')) || 1000;
  new ProgressPlugin({ handler, modulesCount }).apply(compiler);
};

const startManager = async ({
  startTime,
  options,
  configType,
  outputDir,
  configDir,
  skipBuilding,
}) => {
  let managerConfig;
  if (!skipBuilding) {
    // this is pretty slow
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
      options.cache.set('managerConfig', configString);
      if (configString === cachedConfig) {
        logger.info('=> Using cached manager');
        useCachedManager(managerConfig.output.path);
        managerConfig = null;
      }
    } else {
      options.cache.remove('managerConfig');
    }
  }

  if (!managerConfig) {
    return { managerStats: {}, managerTotalTime: 0 };
  }

  const compiler = webpack(managerConfig);
  const middleware = webpackDevMiddleware(compiler, {
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

const startPreview = async ({ startTime, options, configType, outputDir }) => {
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
  await useProgressReporting(compiler, options, startTime);

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

export async function storybookDevServer(options) {
  const app = express();
  const server = await getServer(app, options);

  const configDir = path.resolve(options.configDir);
  const outputDir = options.smokeTest
    ? resolvePathInStorybookCache('public')
    : path.resolve(options.outputDir || resolvePathInStorybookCache('public'));
  const configType = 'DEVELOPMENT';
  const startTime = process.hrtime();

  if (typeof options.extendServer === 'function') {
    options.extendServer(server);
  }

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  await useStatics(app, options);

  app.get('/', (request, response) => {
    response.set('Content-Type', 'text/html');
    response.sendFile(path.join(`${outputDir}/index.html`));
  });
  app.get(/\/sb_dll\/(.+\.js)$/, (request, response) => {
    response.set('Content-Type', 'text/javascript');
    response.sendFile(path.join(`${dllPath}/${request.params[0]}`));
  });
  app.get(/\/sb_dll\/(.+\.LICENCE)$/, (request, response) => {
    response.set('Content-Type', 'text/html');
    response.sendFile(path.join(`${dllPath}/${request.params[0]}`));
  });

  getMiddleware(configDir)(router);
  app.use(router);

  const { port, host } = options;
  const proto = options.https ? 'https' : 'http';
  const address = `${proto}://${host || 'localhost'}:${port}/`;
  const networkAddress = `${proto}://${ip.address()}:${port}/`;

  await new Promise((resolve, reject) => {
    server.listen({ port, host }, (error) => (error ? reject(error) : resolve()));
  });

  let skipBuilding = false;
  if (options.managerCache) {
    const prebuiltDir = path.join(__dirname, '../../prebuilt');
    if (await canUsePrebuiltManager({ prebuiltDir, configDir })) {
      logger.info('=> Using prebuilt manager');
      useCachedManager(prebuiltDir);
      skipBuilding = true;
    }
  }

  const openBrowser = async (result) => {
    if (!options.ci) openInBrowser(address);
    return result;
  };

  // Build the manager and preview in parallel.
  // Start the server (and open the browser) as soon as the manager is ready.
  // Bail if the manager fails, but continue if the preview fails.
  const [previewResult, managerResult] = await Promise.all([
    startPreview({ startTime, options, configType, outputDir }),
    startManager({ startTime, options, configType, outputDir, configDir, skipBuilding })
      .then(openBrowser)
      .catch(bailPreview),
  ]);

  return { ...previewResult, ...managerResult, address, networkAddress };
}
