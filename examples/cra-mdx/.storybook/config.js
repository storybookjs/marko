import { load, addParameters } from '@storybook/react';
import { create } from '@storybook/theming';
import { Wrapper } from '@storybook/components';
import { Info } from './Info';

addParameters({
  options: {
    docs: {
      inlineStories: true,
      mdxComponents: {
        wrapper: Wrapper,
      },
    },
    theme: create({
      base: 'light',
      colorSecondary: 'darkorange',
    }),
  },
  docs: Info,
});

load(require.context('../src', true, /\.stories\.js$/), module);
load(require.context('../src', true, /\.stories\.mdx$/), module);
