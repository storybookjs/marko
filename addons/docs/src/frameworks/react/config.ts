import { StoryFn } from '@storybook/addons';
import { extractArgTypes } from './extractArgTypes';
import { extractComponentDescription } from '../../lib/docgen';

export const parameters = {
  docs: {
    // react is Storybook's "native" framework, so it's stories are inherently prepared to be rendered inline
    // NOTE: that the result is a react element. Hooks support is provided by the outer code.
    prepareForInline: (storyFn: StoryFn) => storyFn(),
    extractArgTypes,
    extractComponentDescription,
  },
};
