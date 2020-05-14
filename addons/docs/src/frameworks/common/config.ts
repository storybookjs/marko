import { DocsContainer, DocsPage } from '../../blocks';
import { enhanceArgTypes } from './enhanceArgTypes';

export const parameters = {
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
};

export const argTypesEnhancers = [enhanceArgTypes];
