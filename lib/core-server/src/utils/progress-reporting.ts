import { Compiler, ProgressPlugin } from 'webpack';
import { router } from '../dev-server';
import { printDuration } from './print-duration';

export const useProgressReporting = async (
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
      // arg3 undefined in webpack5
      const counts = (arg3 && arg3.match(/(\d+)\/(\d+)/)) || [];
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

  const modulesCount = (await options.cache?.get('modulesCount').catch(() => {})) || 1000;
  new ProgressPlugin({ handler, modulesCount }).apply(compiler);
};
