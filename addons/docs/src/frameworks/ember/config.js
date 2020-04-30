import { addParameters } from '@storybook/client-api';
import { extractArgTypes, extractComponentDescription } from './jsondoc';

addParameters({
  docs: {
    iframeHeight: 80,
    extractArgTypes,
    extractComponentDescription,
  },
});
