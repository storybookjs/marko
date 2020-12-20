import path from 'path';
import { pathExists } from 'fs-extra';
import dedent from 'ts-dedent';
import chalk from 'chalk';

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
