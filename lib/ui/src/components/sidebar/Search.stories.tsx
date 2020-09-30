import React from 'react';
import { isRoot } from '@storybook/api';

import { stories } from './mockdata.large';
import Search from './Search';
import SearchResults from './SearchResults';
import { ItemWithRefId } from './types';
import { DEFAULT_REF_ID } from './utils';

const refId = DEFAULT_REF_ID;
const data = { [refId]: { id: refId, url: '/', stories } };
const dataset = { hash: data, entries: Object.entries(data) };
const lastViewed = Object.values(stories)
  .filter((item, index) => item.isComponent && index % 20 === 0)
  .map((component) => ({ storyId: component.id, refId }));

function getPath(item: ItemWithRefId): string[] {
  const parent = !isRoot(item) ? stories[item.parent] : null;
  if (parent) return [...getPath({ refId: item.refId, ...parent }), parent.name];
  return [];
}

export default {
  component: Search,
  title: 'UI/Sidebar/Search',
};

export const Simple = () => <Search dataset={dataset}>{() => null}</Search>;

export const FilledIn = () => (
  <Search dataset={dataset} initialQuery="Search query">
    {() => null}
  </Search>
);

export const LastViewed = () => (
  <Search dataset={dataset} lastViewed={lastViewed}>
    {({ inputValue, results, getMenuProps, getItemProps, highlightedIndex }) => (
      <SearchResults
        isSearching={!!inputValue}
        results={results}
        getPath={getPath}
        getMenuProps={getMenuProps}
        getItemProps={getItemProps}
        highlightedIndex={highlightedIndex}
      />
    )}
  </Search>
);
