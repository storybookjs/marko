import camelcase from 'camelcase';
import { configure } from '@storybook/server';

import stories from './storybook.stories';

const port = process.env.PORT || 8080;

const fetchHtml = async (id, params) => {
  const [component, story] = id.split('--').map(s => camelcase(s));

  const url = new URL(`http://localhost:${port}/storybook_preview/${component}/${story}`);
  url.search = new URLSearchParams(params).toString();

  // eslint-disable-next-line no-undef
  const response = await fetch(url);
  return response.text();
};

configure(() => stories, module, { fetchStoryHtml: fetchHtml });
