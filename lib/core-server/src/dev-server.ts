import { logger } from '@storybook/node-logger';
import open from 'better-opn';
import express, { Router } from 'express';
import path from 'path';
import prettyTime from 'pretty-hrtime';
import dedent from 'ts-dedent';
import Cache from 'file-system-cache';

import * as previewBuilder from '@storybook/builder-webpack4';
import { getMiddleware } from './utils/middleware';
import { getManagerWebpackConfig } from './manager/manager-config';
import { resolvePathInStorybookCache } from './utils/resolve-path-in-sb-cache';
import { getPrebuiltDir } from './utils/prebuilt-manager';
import { getPreviewWebpackConfig } from './preview-config';
import { loadAllPresets } from './presets';
import { useProgressReporting } from './utils/progress-reporting';
import { getServerAddresses } from './utils/server-address';
import { getServer } from './utils/server-init';
import { useStatics } from './utils/server-statics';
import { startManager } from './startManager';

export const defaultFavIcon = require.resolve('./public/favicon.ico');

const cache = Cache({
  basePath: resolvePathInStorybookCache('dev-server'),
  ns: 'storybook', // Optional. A grouping namespace for items.
});

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

  const presets = loadAllPresets({
    configType,
    outputDir,
    cache,
    corePresets: [
      require.resolve('./common/common-preset.js'),
      require.resolve('./manager/manager-preset.js'),
      ...previewBuilder.corePresets,
    ],
    overridePresets: previewBuilder.overridePresets,
    ...options,
  });

  const fullOptions = {
    configType,
    outputDir,
    cache,
    ...options,
    presets,
  };

  // Build the manager and preview in parallel.
  // Start the server (and open the browser) as soon as the manager is ready.
  // Bail if the manager fails, but continue if the preview fails.
  // FIXME: parallelize this!!!
  const previewConfig = await getPreviewWebpackConfig(fullOptions);
  // this is pretty slow (???)
  const managerConfig = !prebuiltDir ? await getManagerWebpackConfig(fullOptions) : null;

  const [previewResult, managerResult] = await Promise.all([
    previewBuilder.start({
      startTime,
      options: fullOptions,
      useProgressReporting,
      router,
      config: previewConfig,
    }),
    startManager({
      startTime,
      options: fullOptions,
      config: managerConfig,
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
