/* eslint-disable-next-line import/no-extraneous-dependencies */
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import { enhanceArgTypes } from './enhanceArgTypes';

export const parameters = {
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
};

export const argTypesEnhancers = [enhanceArgTypes];
