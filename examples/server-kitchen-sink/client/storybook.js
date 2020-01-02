import { configure, addParameters } from '@storybook/server';

import stories from './stories';

const port = process.env.PORT || 8080;

addParameters({ server: { url: `http://localhost:${port}/storybook_preview` } });

console.log('stories', stories);

configure(() => stories, module);
