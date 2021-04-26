import chalk from 'chalk';
import path from 'path';
import { logger } from '@storybook/node-logger';
import { Stats } from 'webpack';

import fs from 'fs-extra';

export async function outputStats(directory: string, previewStats?: any, managerStats?: any) {
  if (previewStats) {
    const filePath = await writeStats(directory, 'preview', previewStats as Stats);
    logger.info(`=> preview stats written to ${chalk.cyan(filePath)}`);
  }
  if (managerStats) {
    const filePath = await writeStats(directory, 'manager', managerStats as Stats);
    logger.info(`=> manager stats written to ${chalk.cyan(filePath)}`);
  }
}

export const writeStats = async (directory: string, name: string, stats: Stats) => {
  const filePath = path.join(directory, `${name}-stats.json`);
  await fs.outputFile(filePath, JSON.stringify(stats.toJson(), null, 2), 'utf8');
  return filePath;
};
