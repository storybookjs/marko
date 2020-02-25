import React from 'react';

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

export const simple = () => <Sidebar menu={menu} stories={stories} storyId={storyId} refs={{}} />;
export const isLoading = () => <Sidebar menu={menu} stories={{}} isLoading refs={{}} />;
