import React from 'react';

import { Explorer } from './Explorer';
import { mockDataset } from './mockdata';
import { RefType } from './types';

export default {
  component: Explorer,
  title: 'UI/Sidebar/Explorer',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (storyFn: any) => <div style={{ padding: '0 20px', maxWidth: '230px' }}>{storyFn()}</div>,
  ],
};

const selected = {
  refId: 'storybook_internal',
  storyId: '1-12-121',
};

const simple: Record<string, RefType> = {
  storybook_internal: {
    title: null,
    id: 'storybook_internal',
    url: 'iframe.html',
    ready: true,
    stories: mockDataset.withRoot,
  },
};

const withRefs: Record<string, RefType> = {
  ...simple,
  basic: {
    id: 'basic',
    title: 'Basic ref',
    url: 'https://example.com',
    ready: true,
    type: 'auto-inject',
    stories: mockDataset.noRoot,
  },
  injected: {
    id: 'injected',
    title: 'Not ready',
    url: 'https://example.com',
    ready: false,
    type: 'auto-inject',
    stories: mockDataset.noRoot,
  },
  unknown: {
    id: 'unknown',
    title: 'Unknown ref',
    url: 'https://example.com',
    ready: true,
    type: 'unknown',
    stories: mockDataset.noRoot,
  },
  lazy: {
    id: 'lazy',
    title: 'Lazy loaded ref',
    url: 'https://example.com',
    ready: false,
    type: 'lazy',
    stories: mockDataset.withRoot,
  },
};

export const Simple = () => (
  <Explorer
    dataset={{ hash: simple, entries: Object.entries(simple) }}
    selected={selected}
    isLoading={false}
    isBrowsing
  />
);

export const WithRefs = () => (
  <Explorer
    dataset={{ hash: withRefs, entries: Object.entries(withRefs) }}
    selected={selected}
    isLoading={false}
    isBrowsing
  />
);
