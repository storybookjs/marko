import express, { Router } from 'express';
import path from 'path';

import {
  getInterpretedFile,
  logConfig,
  resolvePathInStorybookCache,
  serverRequire,
  loadAllPresets,
} from '@storybook/core-common';
import { getMiddleware } from './utils/middleware';
import { getManagerWebpackConfig } from './manager/manager-config';

import { getPrebuiltDir } from './utils/prebuilt-manager';
import { getServerAddresses } from './utils/server-address';
import { getServer } from './utils/server-init';
import { useStatics } from './utils/server-statics';
import { startManager } from './startManager';

import { useProgressReporting } from './utils/progress-reporting';
import { cache } from './utils/cache';
import { openInBrowser } from './utils/open-in-browser';

export const defaultFavIcon = require.resolve('./public/favicon.ico');

// @ts-ignore
export const router: Router = new Router();

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

  const { core } = serverRequire(getInterpretedFile(path.resolve(configDir, 'main')));
  const builder = core?.builder || 'webpack4';

  const previewBuilder = await import(`@storybook/builder-${builder}`);

  const presets = loadAllPresets({
    configType,
    outputDir,
    cache,
    corePresets: [
      require.resolve('./presets/common-preset.js'),
      require.resolve('./presets/manager-preset.js'),
      ...previewBuilder.corePresets,
      require.resolve('./presets/babel-cache-preset'),
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
  const managerConfig = !prebuiltDir ? await getManagerWebpackConfig(fullOptions) : null;

  if (options.debugWebpack) {
    logConfig('Preview webpack config', await previewBuilder.getConfig(options));
    logConfig('Manager webpack config', managerConfig);
  }

  const preview = options.ignorePreview
    ? Promise.resolve()
    : previewBuilder.start({
        startTime,
        options: fullOptions,
        useProgressReporting,
        router,
      });

  const [previewResult, managerResult] = await Promise.all([
    preview,
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

  return { previewResult, managerResult, address, networkAddress };
}
