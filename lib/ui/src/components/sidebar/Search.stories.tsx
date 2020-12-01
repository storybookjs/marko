import React from 'react';
import { action } from '@storybook/addon-actions';

import { stories } from './mockdata.large';
import { Search } from './Search';
import { SearchResults } from './SearchResults';
import { noResults } from './SearchResults.stories';
import { DEFAULT_REF_ID } from './data';
import { Selection } from './types';

const refId = DEFAULT_REF_ID;
const data = { [refId]: { id: refId, url: '/', stories } };
const dataset = { hash: data, entries: Object.entries(data) };
const getLastViewed = () =>
  Object.values(stories)
    .filter((item, index) => item.isComponent && index % 20 === 0)
    .map((component) => ({ storyId: component.id, refId }));

export default {
  component: Search,
  title: 'UI/Sidebar/Search',
  parameters: { layout: 'fullscreen' },
  decorators: [(storyFn: any) => <div style={{ padding: 20, maxWidth: '230px' }}>{storyFn()}</div>],
};

const baseProps = {
  dataset,
  clearLastViewed: action('clear'),
  getLastViewed: () => [] as Selection[],
};

export const Simple = () => <Search {...baseProps}>{() => null}</Search>;

export const FilledIn = () => (
  <Search {...baseProps} initialQuery="Search query">
    {() => <SearchResults {...noResults} />}
  </Search>
);

export const LastViewed = () => (
  <Search {...baseProps} getLastViewed={getLastViewed}>
    {({ query, results, closeMenu, getMenuProps, getItemProps, highlightedIndex }) => (
      <SearchResults
        query={query}
        results={results}
        closeMenu={closeMenu}
        getMenuProps={getMenuProps}
        getItemProps={getItemProps}
        highlightedIndex={highlightedIndex}
      />
    )}
  </Search>
);

export const ShortcutsDisabled = () => (
  <Search {...baseProps} enableShortcuts={false}>
    {() => null}
  </Search>
);
