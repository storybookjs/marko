import React from 'react';
import { StoryFn } from '@storybook/addons';

export const parameters = {
  docs: {
    inlineStories: true,
    prepareForInline: (storyFn: StoryFn<string>) => (
      // eslint-disable-next-line react/no-danger
      <div dangerouslySetInnerHTML={{ __html: storyFn() }} />
    ),
  },
};
