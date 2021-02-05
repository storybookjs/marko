import express, { Router } from 'express';
import path from 'path';

import {
  getInterpretedFile,
  logConfig,
  resolvePathInStorybookCache,
  serverRequire,
  loadAllPresets,
  CLIOptions,
  LoadOptions,
  Options,
  RenamedOptions,
} from '@storybook/core-common';

import { getMiddleware } from './utils/middleware';
import { getServerAddresses } from './utils/server-address';
import { getServer } from './utils/server-init';
import { useStatics } from './utils/server-statics';

import * as managerBuilder from './manager/builder';

import { useProgressReporting } from './utils/progress-reporting';
import { cache } from './utils/cache';
import { openInBrowser } from './utils/open-in-browser';

// @ts-ignore
export const router: Router = new Router();

export async function storybookDevServer(options: CLIOptions & LoadOptions & RenamedOptions) {
  const app = express();
  const server = await getServer(app, options);

  const configDir = path.resolve(options.configDir);
  const outputDir = options.smokeTest
    ? resolvePathInStorybookCache('public')
    : path.resolve(options.outputDir || resolvePathInStorybookCache('public'));
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

  const { core } = serverRequire(getInterpretedFile(path.resolve(configDir, 'main')));
  const builder = core?.builder || 'webpack4';

  const previewBuilder = await import(`@storybook/builder-${builder}`);

  const presets = loadAllPresets({
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

  const fullOptions: Options = {
    outputDir,
    cache,
    ...options,
    presets,
  };

  // Build the manager and preview in parallel.
  // Start the server (and open the browser) as soon as the manager is ready.
  // Bail if the manager fails, but continue if the preview fails.
  // FIXME: parallelize this!!!

  if (options.debugWebpack) {
    logConfig('Preview webpack config', await previewBuilder.getConfig(fullOptions));
    logConfig('Manager webpack config', await managerBuilder.getConfig(fullOptions));
  }

  const preview = options.ignorePreview
    ? Promise.resolve()
    : previewBuilder.start({
        startTime,
        options: fullOptions,
        useProgressReporting,
        router,
      });

  const manager = managerBuilder.start({
    startTime,
    options: fullOptions,
    useProgressReporting,
    router,
  });

  const [previewResult, managerResult] = await Promise.all([
    preview,
    manager
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
