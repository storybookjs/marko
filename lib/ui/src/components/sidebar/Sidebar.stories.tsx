import React from 'react';

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
    title: 'This is a ref',
    url: 'https://example.com',
    ready: false,
    type: 'lazy',
    stories,
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
