import React from 'react';
import { load, addDecorator, addParameters } from '@storybook/react';
import { themes, create } from '@storybook/theming';
import { DocsPage } from '@storybook/addon-docs/blocks';
import { getPropDefs } from '@storybook/addon-docs/react';

addParameters({
  options: {
    docs: {
      inlineStories: true,
      getPropDefs,
    },
    theme: themes.light,
  },
  docs: DocsPage,
  notes: 'global notes',
});

// addDecorator(storyFn => <div style={{ border: '2px solid red' }}>{storyFn()}</div>);

load(require.context('../src', true, /\.stories\.[tj]sx?$/), module);
load(require.context('../src', true, /\.stories\.mdx$/), module);
