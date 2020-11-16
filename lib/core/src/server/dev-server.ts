import { logger } from '@storybook/node-logger';
import open from 'better-opn';
import express, { Express, Router } from 'express';
import { pathExists, readFile } from 'fs-extra';
import http from 'http';
import https from 'https';
import ip from 'ip';
import path from 'path';
import prettyTime from 'pretty-hrtime';
import { stringify } from 'telejson';
import dedent from 'ts-dedent';
import favicon from 'serve-favicon';
import webpack, { Compiler, ProgressPlugin, Stats } from 'webpack';
import webpackDevMiddleware, { WebpackDevMiddleware } from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

// eslint-disable-next-line import/no-extraneous-dependencies
import { NextHandleFunction } from 'connect';
import { getMiddleware } from './utils/middleware';
import { logConfig } from './logConfig';
import loadConfig from './config';
import loadManagerConfig from './manager/manager-config';
import { resolvePathInStorybookCache } from './utils/resolve-path-in-sb-cache';
import { getPrebuiltDir } from './utils/prebuilt-manager';
import { ManagerResult, PreviewResult } from './types';

const defaultFavIcon = require.resolve('./public/favicon.ico');

const cache = {};

let previewProcess: WebpackDevMiddleware & NextHandleFunction;
let previewReject: (reason?: any) => void;

const bailPreview = (e: Error) => {
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

async function getServer(
  app: Express,
  options: {
    https?: boolean;
    sslCert?: string;
    sslKey?: string;
    sslCa?: string[];
  }
) {
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

async function useStatics(router: any, options: { staticDir?: string[] }) {
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
        router.use(staticEndpoint, express.static(localStaticPath, { index: false }));

        const faviconPath = path.resolve(localStaticPath, 'favicon.ico');

        if (await pathExists(faviconPath)) {
          hasCustomFavicon = true;
          router.use(favicon(faviconPath));
        }
      })
    );
  }

  if (!hasCustomFavicon) {
    router.use(favicon(defaultFavIcon));
  }
}

function openInBrowser(address: string) {
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

// @ts-ignore
const router: Router = new Router();

const printDuration = (startTime: [number, number]) =>
  prettyTime(process.hrtime(startTime))
    .replace(' ms', ' milliseconds')
    .replace(' s', ' seconds')
    .replace(' m', ' minutes');

const useProgressReporting = async (
  compiler: Compiler,
  options: any,
  startTime: [number, number]
) => {
  let value = 0;
  let totalModules: number;
  let reportProgress: (progress?: {
    value?: number;
    message: string;
    modules?: any;
  }) => void = () => {};

  router.get('/progress', (request, response) => {
    let closed = false;
    const close = () => {
      closed = true;
      response.end();
    };
    response.on('close', close);

    if (closed || response.writableEnded) return;
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Connection', 'keep-alive');
    response.flushHeaders();

    reportProgress = (progress: any) => {
      if (closed || response.writableEnded) return;
      response.write(`data: ${JSON.stringify(progress)}\n\n`);
      if (progress.value === 1) close();
    };
  });

  const handler = (newValue: number, message: string, arg3: any) => {
    value = Math.max(newValue, value); // never go backwards
    const progress = { value, message: message.charAt(0).toUpperCase() + message.slice(1) };
    if (message === 'building') {
      const counts = arg3.match(/(\d+)\/(\d+)/) || [];
      const complete = parseInt(counts[1], 10);
      const total = parseInt(counts[2], 10);
      if (!Number.isNaN(complete) && !Number.isNaN(total)) {
        (progress as any).modules = { complete, total };
        totalModules = total;
      }
    }

    if (value === 1) {
      if (options.cache) {
        options.cache.set('modulesCount', totalModules);
      }

      if (!progress.message) {
        progress.message = `Completed in ${printDuration(startTime)}.`;
      }
    }
    reportProgress(progress);
  };

  const modulesCount = (await options.cache?.get('modulesCount')) || 1000;
  new ProgressPlugin({ handler, modulesCount }).apply(compiler);
};

const startManager = async ({
  startTime,
  options,
  configType,
  outputDir,
  configDir,
  prebuiltDir,
}: any): Promise<ManagerResult> => {
  let managerConfig;
  if (!prebuiltDir) {
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
      logConfig('Manager webpack config', managerConfig);
    }

    if (options.cache) {
      if (options.managerCache) {
        const configString = stringify(managerConfig);
        const cachedConfig = await options.cache.get('managerConfig');
        options.cache.set('managerConfig', configString);
        if (configString === cachedConfig && (await pathExists(outputDir))) {
          logger.info('=> Using cached manager');
          managerConfig = null;
        }
      } else {
        options.cache.remove('managerConfig');
      }
    }
  }

  if (!managerConfig) {
    // FIXME: This object containing default values should match ManagerResult
    // @ts-ignore
    return { managerStats: {}, managerTotalTime: 0 } as ManagerResult;
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
    // @ts-ignore
    clientLogLevel: 'warning',
    noInfo: true,
  });

  router.get(/\/static\/media\/.*\..*/, (request, response, next) => {
    response.set('Cache-Control', `public, max-age=31536000`);
    next();
  });

  router.use(middleware);

  const managerStats: Stats = await new Promise((resolve) => middleware.waitUntilValid(resolve));
  if (!managerStats) throw new Error('no stats after building preview');
  if (managerStats.hasErrors()) throw managerStats;
  return { managerStats, managerTotalTime: process.hrtime(startTime) };
};

const startPreview = async ({
  startTime,
  options,
  configType,
  outputDir,
}: any): Promise<PreviewResult> => {
  if (options.ignorePreview) {
    // FIXME: This object containing default values should match PreviewResult
    // @ts-ignore
    return { previewStats: {}, previewTotalTime: 0 } as PreviewResult;
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
    logConfig('Preview webpack config', previewConfig);
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
    // @ts-ignore
    ...previewConfig.devServer,
  });

  router.use(previewProcess as any);
  router.use(webpackHotMiddleware(compiler));

  const previewStats: Stats = await new Promise((resolve, reject) => {
    previewProcess.waitUntilValid(resolve);
    previewReject = reject;
  });
  if (!previewStats) throw new Error('no stats after building preview');
  if (previewStats.hasErrors()) throw previewStats;
  return { previewStats, previewTotalTime: process.hrtime(startTime) };
};

export async function storybookDevServer(options: any) {
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

  // User's own static files
  await useStatics(router, options);

  getMiddleware(configDir)(router);
  app.use(router);

  const { port, host } = options;
  const proto = options.https ? 'https' : 'http';
  const address = `${proto}://${host || 'localhost'}:${port}/`;
  const networkAddress = `${proto}://${ip.address()}:${port}/`;

  await new Promise((resolve, reject) => {
    // FIXME: Following line doesn't match TypeScript signature at all 🤔
    // @ts-ignore
    server.listen({ port, host }, (error: Error) => (error ? reject(error) : resolve()));
  });

  const prebuiltDir = await getPrebuiltDir({ configDir, options });

  // Manager static files
  router.use('/', express.static(prebuiltDir || outputDir));

  // Build the manager and preview in parallel.
  // Start the server (and open the browser) as soon as the manager is ready.
  // Bail if the manager fails, but continue if the preview fails.
  const [previewResult, managerResult] = await Promise.all([
    startPreview({ startTime, options, configType, outputDir }),
    startManager({ startTime, options, configType, outputDir, configDir, prebuiltDir })
      // TODO #13083 Restore this when compiling the preview is fast enough
      // .then((result) => {
      //   if (!options.ci) openInBrowser(address);
      //   return result;
      // })
      .catch(bailPreview),
  ]);

  // TODO #13083 Remove this when compiling the preview is fast enough
  if (!options.ci) openInBrowser(address);

  return { ...previewResult, ...managerResult, address, networkAddress };
}
