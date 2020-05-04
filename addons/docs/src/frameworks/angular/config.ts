import { addParameters } from '@storybook/client-api';
import { extractArgTypes, extractComponentDescription } from './compodoc';

addParameters({
  docs: {
    extractArgTypes,
    extractComponentDescription,
  },
});
