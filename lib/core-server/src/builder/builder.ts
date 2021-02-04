import webpack, { Stats } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { logger } from '@storybook/node-logger';
import { logConfig } from './logConfig';
import { PreviewResult } from './types';

let previewProcess: ReturnType<typeof webpackDevMiddleware>;
let previewReject: (reason?: any) => void;

export const start = async ({
  startTime,
  options,
  useProgressReporting,
  router,
  config: previewConfig,
}: any): Promise<PreviewResult> => {
  if (options.ignorePreview) {
    return {};
  }

  if (options.debugWebpack) {
    logConfig('Preview webpack config', previewConfig);
  }

  console.dir(previewConfig, { depth: 30 });

  const compiler = webpack(previewConfig);
  await useProgressReporting(compiler, options, startTime);

  const middlewareOptions: Parameters<typeof webpackDevMiddleware>[1] = {
    publicPath: previewConfig.output?.publicPath as string,
    writeToDisk: true,
  };
  previewProcess = webpackDevMiddleware(compiler, middlewareOptions);

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

export const bail = (e: Error) => {
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

export const corePresets = [require.resolve('./preview/preview-preset.js')];
export const overridePresets = [require.resolve('./preview/custom-webpack-preset.js')];
