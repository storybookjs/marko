import React from 'react';
import { configure, addParameters } from '@storybook/server';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

import stories from './stories';

const port = process.env.PORT || 1337;

addParameters({
  server: { url: `http://localhost:${port}/storybook_preview` },
  docs: { page: DocsPage, container: DocsContainer },
});

console.log('stories', stories);

configure(() => stories, module);
