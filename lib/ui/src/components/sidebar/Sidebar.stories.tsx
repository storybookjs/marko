import React from 'react';

import { ThemeProvider, themes, ensure as ensureTheme } from '@storybook/theming';
import Sidebar from './Sidebar';
import { standardData as standardHeaderData } from './Heading.stories';
import { mockDataset } from './mockdata';
import { RefType } from './RefHelpers';

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

const refs: Record<string, RefType> = {
  optimized: {
    id: 'optimized',
    title: 'It is optimized',
    url: 'https://example.com',
    ready: false,
    type: 'lazy',
    stories,
  },
  empty: {
    id: 'empty',
    title: 'It is empty',
    url: 'https://example.com',
    ready: false,
    type: 'lazy',
    stories: {},
  },
  startInjected_unknown: {
    id: 'startInjected_unknown',
    title: 'It started injected and is ready',
    url: 'https://example.com',
    type: 'unknown',
    ready: false,
    stories,
  },
  startInjected_loading: {
    id: 'startInjected_loading',
    title: 'It started injected and is loading',
    url: 'https://example.com',
    type: 'auto-inject',
    ready: false,
    stories,
  },
  startInjected_ready: {
    id: 'startInjected_ready',
    title: 'It started injected and is ready',
    url: 'https://example.com',
    type: 'auto-inject',
    ready: true,
    stories,
  },
  versions: {
    id: 'versions',
    title: 'It has versions',
    url: 'https://example.com',
    type: 'lazy',
    stories,
    versions: { '1.0.0': 'https://example.com/v1', '2.0.0': 'https://example.com' },
  },
  error: {
    id: 'error',
    title: 'This has problems',
    url: 'https://example.com',
    type: 'lazy',
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
    type: 'lazy',
    stories: {},
    loginUrl: 'https://example.com',
  },
  long: {
    id: 'long',
    title: 'This storybook has a very very long name for some reason',
    url: 'https://example.com',
    stories,
    type: 'lazy',
    versions: {
      '111.111.888-new': 'https://example.com/new',
      '111.111.888': 'https://example.com',
    },
  },
};

export const simple = () => (
  <Sidebar storiesConfigured menu={menu} stories={stories} storyId={storyId} refs={{}} />
);
export const isLoading = () => (
  <Sidebar storiesConfigured={false} menu={menu} stories={{}} isLoading refs={{}} />
);
export const isEmpty = () => (
  <Sidebar storiesConfigured menu={menu} stories={{}} isLoading refs={{}} />
);
export const withRefs = () => (
  <Sidebar storiesConfigured menu={menu} stories={stories} isLoading refs={refs} />
);

export const darkWithRefs = () => (
  <ThemeProvider theme={ensureTheme(themes.dark)}>
    <Sidebar storiesConfigured menu={menu} stories={stories} isLoading refs={refs} />
  </ThemeProvider>
);

darkWithRefs.parameters = {
  backgrounds: {
    default: 'dark',
    values: [{ name: 'dark', value: '#222222', default: true }],
  },
};
