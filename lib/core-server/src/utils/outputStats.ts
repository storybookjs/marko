import chalk from 'chalk';
import { logger } from '@storybook/node-logger';
import { Stats } from 'webpack';
import { writeStats } from '../build-dev';

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
