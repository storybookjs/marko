import React from 'react';
import { StoriesHash } from '@storybook/api';

import { mockDataset } from './mockdata';
import SearchResults from './SearchResults';
import { CombinedDataset, Refs, SearchItem } from './types';
import { searchItem } from './utils';

export default {
  component: SearchResults,
  title: 'UI/Sidebar/SearchResults',
  includeStories: /^[A-Z]/,
};

const combinedDataset = (stories: StoriesHash, refId: string): CombinedDataset => {
  const hash: Refs = {
    [refId]: {
      stories,
      title: null,
      id: refId,
      url: 'iframe.html',
      ready: true,
      error: false,
    },
  };
  return { hash, entries: Object.entries(hash) };
};

const withRoot = combinedDataset(mockDataset.withRoot, 'internal');

const internal = Object.values(withRoot.hash.internal.stories).map((item) =>
  searchItem(item, withRoot.hash.internal)
);
const composed = Object.values(mockDataset.noRoot).map((item) =>
  searchItem(item, withRoot.hash.internal)
);
const stories: SearchItem[] = internal.concat(composed);

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
  getMenuProps: () => ({}),
  getItemProps: () => ({}),
  highlightedIndex: 0,
};
const lastViewed = {
  isSearching: false,
  results: recents,
  getMenuProps: () => ({}),
  getItemProps: () => ({}),
  highlightedIndex: 0,
};

export const Searching = () => <SearchResults {...searching} />;

export const LastViewed = () => <SearchResults {...lastViewed} />;
