import React from 'react';

import { stories } from './mockdata.large';
import { Search } from './Search';
import { SearchResults } from './SearchResults';
import { DEFAULT_REF_ID } from './data';

const refId = DEFAULT_REF_ID;
const data = { [refId]: { id: refId, url: '/', stories } };
const dataset = { hash: data, entries: Object.entries(data) };
const lastViewed = Object.values(stories)
  .filter((item, index) => item.isComponent && index % 20 === 0)
  .map((component) => ({ storyId: component.id, refId }));

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
        getMenuProps={getMenuProps}
        getItemProps={getItemProps}
        highlightedIndex={highlightedIndex}
      />
    )}
  </Search>
);
