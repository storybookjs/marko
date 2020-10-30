import React from 'react';

import { Ref } from './Refs';
import { standardData as standardHeaderData } from './Heading.stories';
import { mockDataset } from './mockdata';
import { RefType } from './types';

export default {
  component: Ref,
  title: 'UI/Sidebar/Refs',
  excludeStories: /.*Data$/,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (storyFn: any) => <div style={{ padding: '0 20px', maxWidth: '230px' }}>{storyFn()}</div>,
  ],
};

const { menu } = standardHeaderData;
const stories = mockDataset.withRoot;
const storyId = '1-12-121';

export const simpleData = { menu, stories, storyId };
export const loadingData = { menu, stories: {} };

const error: Error = (() => {
  try {
    throw new Error('There was a severe problem');
  } catch (e) {
    return e;
  }
})();

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
    title: 'It is empty because no stories were loaded',
    url: 'https://example.com',
    ready: false,
    type: 'lazy',
    stories: {},
  },
  startInjected_unknown: {
    id: 'startInjected_unknown',
    title: 'It started injected and is unknown',
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
  versionsMissingCurrent: {
    id: 'versions_missing_current',
    title: 'It has versions',
    url: 'https://example.com',
    type: 'lazy',
    stories,
    versions: { '1.0.0': 'https://example.com/v1', '2.0.0': 'https://example.com/v2' },
  },
  error: {
    id: 'error',
    title: 'This has problems',
    url: 'https://example.com',
    type: 'lazy',
    stories: {},
    error,
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

export const Optimized = () => (
  <Ref
    {...refs.optimized}
    isLoading={false}
    isBrowsing
    selectedStoryId=""
    highlightedItemId=""
    setHighlighted={() => {}}
  />
);
export const IsEmpty = () => (
  <Ref
    {...refs.empty}
    isLoading={false}
    isBrowsing
    selectedStoryId=""
    highlightedItemId=""
    setHighlighted={() => {}}
  />
);
export const StartInjectedUnknown = () => (
  <Ref
    {...refs.startInjected_unknown}
    isLoading={false}
    isBrowsing
    selectedStoryId=""
    highlightedItemId=""
    setHighlighted={() => {}}
  />
);
export const StartInjectedLoading = () => (
  <Ref
    {...refs.startInjected_loading}
    isLoading={false}
    isBrowsing
    selectedStoryId=""
    highlightedItemId=""
    setHighlighted={() => {}}
  />
);
export const StartInjectedReady = () => (
  <Ref
    {...refs.startInjected_ready}
    isLoading={false}
    isBrowsing
    selectedStoryId=""
    highlightedItemId=""
    setHighlighted={() => {}}
  />
);
export const Versions = () => (
  <Ref
    {...refs.versions}
    isLoading={false}
    isBrowsing
    selectedStoryId=""
    highlightedItemId=""
    setHighlighted={() => {}}
  />
);
export const VersionsMissingCurrent = () => (
  <Ref
    {...refs.versionsMissingCurrent}
    isLoading={false}
    isBrowsing
    selectedStoryId=""
    highlightedItemId=""
    setHighlighted={() => {}}
  />
);
export const Errored = () => (
  <Ref
    {...refs.error}
    isLoading={false}
    isBrowsing
    selectedStoryId=""
    highlightedItemId=""
    setHighlighted={() => {}}
  />
);
export const Auth = () => (
  <Ref
    {...refs.auth}
    isLoading={false}
    isBrowsing
    selectedStoryId=""
    highlightedItemId=""
    setHighlighted={() => {}}
  />
);
export const Long = () => (
  <Ref
    {...refs.long}
    isLoading={false}
    isBrowsing
    selectedStoryId=""
    highlightedItemId=""
    setHighlighted={() => {}}
  />
);
