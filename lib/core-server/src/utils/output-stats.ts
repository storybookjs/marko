import chalk from 'chalk';
import { logger } from '@storybook/node-logger';
import { Stats } from 'webpack';

import fs from 'fs-extra';

import { resolvePathInStorybookCache } from '@storybook/core-common';

export async function outputStats(previewStats: Stats, managerStats: Stats) {
  if (previewStats) {
    const filePath = await writeStats('preview', previewStats);
    logger.info(`=> preview stats written to ${chalk.cyan(filePath)}`);
  }
  if (managerStats) {
    const filePath = await writeStats('manager', managerStats);
    logger.info(`=> manager stats written to ${chalk.cyan(filePath)}`);
  }
}

export const writeStats = async (name: string, stats: Stats) => {
  const filePath = resolvePathInStorybookCache(`public/${name}-stats.json`);
  await fs.writeFile(filePath, JSON.stringify(stats.toJson(), null, 2), 'utf8');
  return filePath;
};
