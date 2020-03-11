import React from 'react';
import { DecoratorFn } from '@storybook/react';

import { Spaced } from '@storybook/components';

import SidebarStories from './SidebarStories';
import { mockDataset } from './treeview/treeview.mockdata';

export default {
  component: SidebarStories,
  title: 'UI/Sidebar/SidebarStories',
  decorators: [s => <Spaced>{s()}</Spaced>] as DecoratorFn[],
  excludeStories: /.*Data$/,
};

export const withRootData = {
  stories: mockDataset.withRoot,
  storyId: '1-12-121',
};

export const withRoot = () => (
  <SidebarStories stories={mockDataset.withRoot} storyId="1-12-121" isLoading={false} />
);

export const noRootData = {
  stories: mockDataset.noRoot,
  storyId: '1-12-121',
};

export const noRoot = () => (
  <SidebarStories stories={mockDataset.noRoot} storyId="1-12-121" isLoading={false} />
);

export const emptyData = {
  stories: {},
};

export const empty = () => <SidebarStories stories={{}} isLoading={false} />;

export const isLoading = () => <SidebarStories isLoading stories={{}} />;
