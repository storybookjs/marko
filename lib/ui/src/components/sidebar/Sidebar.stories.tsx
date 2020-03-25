import React from 'react';

import { ThemeProvider, themes, ensure as ensureTheme } from '@storybook/theming';
import Sidebar from './Sidebar';
import { standardData as standardHeaderData } from './Heading.stories';
import { mockDataset } from './mockdata';

export default {
  component: Sidebar,
  title: 'UI/Sidebar/Sidebar',
  excludeStories: /.*Data$/,
};

const { menu } = standardHeaderData;
const stories = mockDataset.withRoot;
const storyId = '1-12-121';

export const simpleData = { menu, stories, storyId };
export const loadingData = { menu, stories: {} };

const refs = {
  completed: {
    id: 'completed',
    title: 'All completed',
    url: 'https://example.com',
    stories,
  },
  loading: {
    id: 'loading',
    title: 'This is Loading',
    url: 'https://example.com',
    stories: {},
  },
  startInjected: {
    id: 'startInjected',
    title: 'Start Injected',
    url: 'https://example.com',
    stories,
    startInjected: true,
  },
  versions: {
    id: 'versions',
    title: 'It has versions',
    url: 'https://example.com',
    stories,
    versions: { '1.0.0': 'https://example.com/v1', '2.0.0': 'https://example.com' },
  },
  error: {
    id: 'error',
    title: 'This has problems',
    url: 'https://example.com',
    stories: {},
    error: (() => {
      try {
        throw new Error('There was a severe problem');
      } catch (e) {
        return e;
      }
    })(),
  },
  auth: {
    id: 'Authentication',
    title: 'This requires a login',
    url: 'https://example.com',
    stories: {},
    authUrl: 'https://example.com',
  },
  long: {
    id: 'long',
    title: 'This storybook has a very very long name for some reason',
    url: 'https://example.com',
    stories,
    versions: {
      '111.111.888-new': 'https://example.com/new',
      '111.111.888': 'https://example.com',
    },
  },
};

export const simple = () => <Sidebar menu={menu} stories={stories} storyId={storyId} refs={{}} />;
export const isLoading = () => <Sidebar menu={menu} stories={{}} isLoading refs={{}} />;
export const withRefs = () => <Sidebar menu={menu} stories={stories} isLoading refs={refs} />;

export const darkWithRefs = () => (
  <ThemeProvider theme={ensureTheme(themes.dark)}>
    <Sidebar menu={menu} stories={stories} isLoading refs={refs} />
  </ThemeProvider>
);

darkWithRefs.story = {
  parameters: {
    backgrounds: [{ name: 'dark', value: '#222222', default: true }],
  },
};
