import webpackReal, { ProgressPlugin } from 'webpack';
// @ts-ignore
import webpack4, { Stats, Configuration } from '@types/webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { logger } from '@storybook/node-logger';
import { Builder, useProgressReporting } from '@storybook/core-common';

let compilation: ReturnType<typeof webpackDevMiddleware>;
let reject: (reason?: any) => void;

type WebpackBuilder = Builder<Configuration, Stats>;

const webpack = (webpackReal as any) as typeof webpack4;

export const getConfig: WebpackBuilder['getConfig'] = async (options) => {
  const { presets } = options;
  const typescriptOptions = await presets.apply('typescript', {}, options);
  const babelOptions = await presets.apply('babel', {}, { ...options, typescriptOptions });
  const entries = await presets.apply('entries', [], options);
  const stories = await presets.apply('stories', [], options);
  const frameworkOptions = await presets.apply(`${options.framework}Options`, {}, options);

  return presets.apply(
    'webpack',
    {},
    {
      ...options,
      babelOptions,
      entries,
      stories,
      typescriptOptions,
      [`${options.framework}Options`]: frameworkOptions,
    }
  ) as Configuration;
};

export const executor = {
  get: webpack,
};

export const start: WebpackBuilder['start'] = async ({ startTime, options, router }) => {
  const config = await getConfig(options);
  const compiler = executor.get(config);
  if (!compiler) {
    const err = `${config.name}: missing webpack compiler at runtime!`;
    logger.error(err);
    return {
      bail,
      totalTime: process.hrtime(startTime),
      stats: ({
        hasErrors: () => true,
        hasWarngins: () => false,
        toJson: () => ({ warnings: [] as any[], errors: [err] }),
      } as any) as Stats,
    };
  }

  const { handler, modulesCount } = await useProgressReporting(router, startTime, options);
  new ProgressPlugin({ handler, modulesCount }).apply(compiler);

  const middlewareOptions: Parameters<typeof webpackDevMiddleware>[1] = {
    publicPath: config.output?.publicPath as string,
    writeToDisk: true,
    logLevel: 'error',
  };

  compilation = webpackDevMiddleware(compiler, middlewareOptions);

  router.use(compilation);
  router.use(webpackHotMiddleware(compiler));

  const waitUntilValid = compilation.waitUntilValid.bind(compilation) as (
    callback: (stats?: Stats) => void
  ) => void;

  const stats = await new Promise<Stats>((ready, stop) => {
    waitUntilValid(ready);
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

export const build: WebpackBuilder['build'] = async ({ options, startTime }) => {
  logger.info('=> Compiling preview..');
  const config = await getConfig(options);

  const compiler = executor.get(config);
  if (!compiler) {
    const err = `${config.name}: missing webpack compiler at runtime!`;
    logger.error(err);
    return;
  }

  await new Promise<void>((succeed, fail) => {
    compiler.run((error, stats) => {
      if (error || !stats || stats.hasErrors()) {
        logger.error('=> Failed to build the preview');
        process.exitCode = 1;

        if (error) {
          logger.error(error.message);
          return fail(error);
        }

        if (stats && (stats.hasErrors() || stats.hasWarnings())) {
          const { warnings, errors } = stats.toJson(config.stats);

          errors.forEach((e: string) => logger.error(e));
          warnings.forEach((e: string) => logger.error(e));
          return fail(stats);
        }
      }

      logger.trace({ message: '=> Preview built', time: process.hrtime(startTime) });
      if (stats) {
        stats.toJson(config.stats).warnings.forEach((e: string) => logger.warn(e));
      }

      return succeed();
    });
  });
};

export const corePresets = [require.resolve('./presets/preview-preset.js')];
export const overridePresets = [require.resolve('./presets/custom-webpack-preset.js')];
