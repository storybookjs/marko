import globby from 'globby';
import { logger } from '@storybook/node-logger';

interface Options {
  hasTSDependency: boolean;
}

export const warn = ({ hasTSDependency }: Options) => {
  if (!hasTSDependency) {
    const hasTSFiles = !!globby.sync(['**/*.@(ts|tsx)', '!**/node_modules', '!**/*.d.ts']).length;
    if (hasTSFiles) {
      logger.warn(
        'We have detected TypeScript files in your project directory, however TypeScript is not listed as a project dependency.'
      );
      logger.warn('Storybook will continue as though this is a JavaScript project.');
      logger.line();
      logger.info(
        'For more information, see: https://storybook.js.org/docs/configurations/typescript-config/'
      );
    }
  }
};
