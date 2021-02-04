import { logger } from '@storybook/node-logger';
import open from 'better-opn';
import chalk from 'chalk';
import express, { Express, Router } from 'express';
import { pathExists, readFile } from 'fs-extra';
import http from 'http';
import https from 'https';
import ip from 'ip';
import path from 'path';
import prettyTime from 'pretty-hrtime';
import dedent from 'ts-dedent';
import favicon from 'serve-favicon';
import webpack, { Stats } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import Cache from 'file-system-cache';

import * as previewBuilder from '@storybook/builder-webpack4';
import { getMiddleware } from './utils/middleware';
import { logConfig } from './utils/logConfig';
import loadManagerConfig from './manager/manager-config';
import { resolvePathInStorybookCache } from './utils/resolve-path-in-sb-cache';
import { getPrebuiltDir } from './utils/prebuilt-manager';
import { parseStaticDir } from './utils/static-files';
import { ManagerResult } from './types';
import loadConfig from './previewConfig';
import { useManagerCache, clearManagerCache } from './utils/manager-cache';
import { useProgressReporting } from './utils/progress-reporting';

const defaultFavIcon = require.resolve('./public/favicon.ico');

const cache = Cache({
  basePath: resolvePathInStorybookCache('dev-server'),
  ns: 'storybook', // Optional. A grouping namespace for items.
});

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
  let hasCustomFavicon = false;

  if (options.staticDir && options.staticDir.length > 0) {
    await Promise.all(
      options.staticDir.map(async (dir) => {
        try {
          const { staticDir, staticPath, targetEndpoint } = await parseStaticDir(dir);
          logger.info(
            chalk`=> Serving static files from {cyan ${staticDir}} at {cyan ${targetEndpoint}}`
          );
          router.use(targetEndpoint, express.static(staticPath, { index: false }));

          if (!hasCustomFavicon && targetEndpoint === '/') {
            const faviconPath = path.join(staticPath, 'favicon.ico');
            if (await pathExists(faviconPath)) {
              hasCustomFavicon = true;
              router.use(favicon(faviconPath));
            }
          }
        } catch (e) {
          logger.warn(e.message);
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
export const router: Router = new Router();

export const printDuration = (startTime: [number, number]) =>
  prettyTime(process.hrtime(startTime))
    .replace(' ms', ' milliseconds')
    .replace(' s', ' seconds')
    .replace(' m', ' minutes');

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
      corePresets: [
        require.resolve('./common/common-preset.js'),
        require.resolve('./manager/manager-preset.js'),
      ],
      ...options,
    });

    if (options.debugWebpack) {
      logConfig('Manager webpack config', managerConfig);
    }

    if (options.cache) {
      if (options.managerCache) {
        const [useCache, hasOutput] = await Promise.all([
          // must run even if outputDir doesn't exist, otherwise the 2nd run won't use cache
          useManagerCache(options.cache, managerConfig),
          pathExists(outputDir),
        ]);
        if (useCache && hasOutput && !options.smokeTest) {
          logger.info('=> Using cached manager');
          managerConfig = null;
        }
      } else if (!options.smokeTest && (await clearManagerCache(options.cache))) {
        logger.info('=> Cleared cached manager config');
      }
    }
  }

  if (!managerConfig) {
    return {};
  }

  const compiler = webpack(managerConfig);
  const middewareOptions: Parameters<typeof webpackDevMiddleware>[1] = {
    publicPath: managerConfig.output?.publicPath as string,
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

  const managerStats: Stats = await new Promise((resolve) => middleware.waitUntilValid(resolve));
  if (!managerStats) {
    await clearManagerCache(options.cache);
    throw new Error('no stats after building manager');
  }
  if (managerStats.hasErrors()) {
    await clearManagerCache(options.cache);
    throw managerStats;
  }
  return { managerStats, managerTotalTime: process.hrtime(startTime) };
};

export function getServerAddresses(port: number, host: string, proto: string) {
  return {
    address: `${proto}://localhost:${port}/`,
    networkAddress: `${proto}://${host || ip.address()}:${port}/`,
  };
}

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
  const { address, networkAddress } = getServerAddresses(port, host, proto);

  await new Promise<void>((resolve, reject) => {
    server.listen({ port, host }, () => {
      resolve();
    });
  });

  const prebuiltDir = await getPrebuiltDir({ configDir, options });

  // Manager static files
  router.use('/', express.static(prebuiltDir || outputDir));

  // Build the manager and preview in parallel.
  // Start the server (and open the browser) as soon as the manager is ready.
  // Bail if the manager fails, but continue if the preview fails.
  const previewConfig = await loadConfig({
    configType,
    outputDir,
    cache,
    corePresets: [require.resolve('./common/common-preset.js'), ...previewBuilder.corePresets],
    overridePresets: previewBuilder.overridePresets,
    ...options,
  });

  const [previewResult, managerResult] = await Promise.all([
    previewBuilder.start({
      startTime,
      options,
      configType,
      outputDir,
      useProgressReporting,
      router,
      config: previewConfig,
    }),
    startManager({
      startTime,
      options,
      configType,
      outputDir,
      configDir,
      prebuiltDir,
    })
      // TODO #13083 Restore this when compiling the preview is fast enough
      // .then((result) => {
      //   if (!options.ci && !options.smokeTest) openInBrowser(address);
      //   return result;
      // })
      .catch(previewBuilder.bail),
  ]);

  // TODO #13083 Remove this when compiling the preview is fast enough
  if (!options.ci && !options.smokeTest) openInBrowser(networkAddress);

  return { ...previewResult, ...managerResult, address, networkAddress };
}
