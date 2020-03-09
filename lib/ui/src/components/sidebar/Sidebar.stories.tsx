import React from 'react';

import Sidebar from './Sidebar';
import { standardData as standardHeaderData } from './SidebarHeading.stories';
import { withRootData } from './SidebarStories.stories';

export default {
  component: Sidebar,
  title: 'UI/Sidebar/Sidebar',
  excludeStories: /.*Data$/,
};

const { menu } = standardHeaderData;
const { stories, storyId } = withRootData;

export const simpleData = { menu, stories, storyId };
export const isLoadingData = { menu, stories: {} };

export const simple = () => <Sidebar menu={menu} stories={stories} storyId={storyId} />;
export const isLoading = () => <Sidebar menu={menu} stories={{}} isLoading />;
