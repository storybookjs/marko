import React from 'react';
import toReact from '@egoist/vue-to-react';
import { StoryFn, StoryContext } from '@storybook/addons';
import { extractArgTypes } from './extractArgTypes';
import { extractComponentDescription } from '../../lib/docgen';

export const parameters = {
  docs: {
    inlineStories: true,
    prepareForInline: (storyFn: StoryFn, { args }: StoryContext) => {
      const Story = toReact(storyFn());
      return <Story {...args} />;
    },
    extractArgTypes,
    extractComponentDescription,
  },
};
