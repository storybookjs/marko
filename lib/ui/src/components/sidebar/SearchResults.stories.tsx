import React from 'react';
import { isRoot } from '@storybook/api';

import { mockDataset } from './mockdata';
import SearchResults from './SearchResults';
import { ItemWithRefIdAndPath } from './types';

export default {
  component: SearchResults,
  title: 'UI/Sidebar/SearchResults',
  includeStories: /^[A-Z]/,
};

const internal = Object.values(mockDataset.withRoot).map((i) => ({ ...i, refId: 'internal' }));
const composed = Object.values(mockDataset.noRoot).map((i) => ({ ...i, refId: 'composed' }));
const stories: ItemWithRefIdAndPath[] = internal.concat(composed);

function getPath(item: ItemWithRefIdAndPath): string[] {
  const parent = !isRoot(item)
    ? stories.find((i) => i.id === item.parent && i.refId === item.refId)
    : null;
  if (parent) return [...getPath({ refId: item.refId, ...parent }), parent.name];
  return item.refId === 'storybook_internal' ? [] : [item.refId];
}

const results = stories
  .filter(({ name }) => name.includes('A2'))
  .map((item) => {
    const i = item.name.indexOf('A2');
    return { item, matches: [{ value: item.name, indices: [[i, i + 1]] }], score: 0 };
  });

const recents = stories
  .filter((item) => item.isComponent) // even though we track stories, we display them grouped by component
  .map((story) => ({ item: story, matches: [], score: 0 }));

const searching = {
  isSearching: true,
  results,
  getPath,
  getMenuProps: () => ({}),
  getItemProps: () => ({}),
  highlightedIndex: 0,
};
const lastViewed = {
  isSearching: false,
  results: recents,
  getPath,
  getMenuProps: () => ({}),
  getItemProps: () => ({}),
  highlightedIndex: 0,
};

export const Searching = () => <SearchResults {...searching} />;

export const LastViewed = () => <SearchResults {...lastViewed} />;
