import { configure, addParameters } from '@storybook/server';

import * as a11yStories from './stories/addon-a11y.stories';
import * as actionsStories from './stories/addon-actions.stories';
import * as backgroundStories from './stories/addon-backgrounds.stories';
import * as knobsStories from './stories/addon-knobs.stories';
import * as notesStories from './stories/addon-notes.stories';
import * as welcomeStories from './stories/welcome.stories';
import * as demoStories from './stories/demo.stories';

const port = process.env.PORT || 8080;

addParameters({ server: { url: `http://localhost:${port}/storybook_preview` } });

const fetchHtml = async (url, id, params) => {
  const fetchUrl = new URL(`${url}/${id}`);
  fetchUrl.search = new URLSearchParams(params).toString();

  const response = await fetch(fetchUrl);
  return response.text();
};

configure(
  () => [
    a11yStories,
    actionsStories,
    backgroundStories,
    knobsStories,
    notesStories,
    welcomeStories,
    demoStories,
  ],
  module,
  {
    fetchStoryHtml: fetchHtml,
  }
);
