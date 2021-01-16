import { extractArgTypes } from './extractArgTypes';
import { extractComponentDescription } from './extractComponentDescription';
import { prepareForInline } from './prepareForInline';

export const parameters = {
  docs: {
    inlineStories: true,
    prepareForInline,
    extractArgTypes,
    extractComponentDescription,
  },
};
