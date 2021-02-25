import { SourceType } from '../../shared';
import { extractArgTypes, extractComponentDescription } from './compodoc';
import { sourceDecorator } from './sourceDecorator';

export const parameters = {
  docs: {
    extractArgTypes,
    extractComponentDescription,
    source: {
      type: SourceType.DYNAMIC,
      language: 'html',
    },
  },
};

export const decorators = [sourceDecorator];
