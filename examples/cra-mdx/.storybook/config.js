import React from 'react';
import { load, addDecorator, addParameters } from '@storybook/react';
import { themes, create } from '@storybook/theming';
import { DocsPage } from '@storybook/addon-docs/blocks';
import { getPropDefs } from './getPropDefs';

addParameters({
  options: {
    docs: {
      inlineStories: true,
      getPropDefs,
      components: {
        // p: ({ children }) => <b>{children}</b>,
      },
    },
    theme: themes.dark,
  },
  docs: DocsPage,
  notes: 'global notes',
});

// addDecorator(storyFn => <div style={{ border: '2px solid red' }}>{storyFn()}</div>);

load(require.context('../src', true, /\.stories\.js$/), module);
load(require.context('../src', true, /\.stories\.mdx$/), module);
