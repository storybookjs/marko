import camelcase from 'camelcase';
import { configure, setFetchStoryHtml } from '@storybook/server';
import stories from '../server/stories';

const port = process.env.PORT || 8080;

const fetchHtml = async (id, params) => {
  const [component, story] = id.split('--').map(s => camelcase(s));

  const url = `http://localhost:${port}/storybook_preview/${component}/${story}`;

  // eslint-disable-next-line no-undef
  const response = await fetch(url);
  return response.text();
};

const storyBookStories = Object.keys(stories).map(component => {
  const storybookDescription = {
    default: {
      title: component,
    },
  };
  Object.keys(stories[component]).forEach(storyName => {
    storybookDescription[storyName] = () => {};
  });

  return storybookDescription;
});

setFetchStoryHtml(fetchHtml);

configure(() => storyBookStories, module);
