import { logger } from '@storybook/node-logger';
import chalk from 'chalk';
import express from 'express';
import { pathExists } from 'fs-extra';
import path from 'path';
import favicon from 'serve-favicon';

import dedent from 'ts-dedent';

const defaultFavIcon = require.resolve('../public/favicon.ico');

export async function useStatics(router: any, options: { staticDir?: string[] }) {
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

export const parseStaticDir = async (arg: string) => {
  // Split on ':' only if not followed by '\', for Windows compatibility (e.g. 'C:\some\dir')
  const [rawDir, target = '/'] = arg.split(/:(?!\\)/);
  const staticDir = path.isAbsolute(rawDir) ? rawDir : `./${rawDir}`;
  const staticPath = path.resolve(staticDir);
  const targetDir = target.replace(/^\/?/, './');
  const targetEndpoint = targetDir.substr(1);

  if (!(await pathExists(staticPath))) {
    throw new Error(
      dedent(chalk`
        Failed to load static files, no such directory: {cyan ${staticPath}}
        Make sure this directory exists, or omit the {bold -s (--static-dir)} option.
      `)
    );
  }

  return { staticDir, staticPath, targetDir, targetEndpoint };
};
