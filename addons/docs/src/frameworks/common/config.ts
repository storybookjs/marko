/* eslint-disable-next-line import/no-extraneous-dependencies */
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import { enhanceSource } from './enhanceSource';

export const parameters = {
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
};

export const parameterEnhancers = [enhanceSource];
