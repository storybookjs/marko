/* eslint-env browser */

import React, { FunctionComponent, useEffect, useMemo, useState, useCallback } from 'react';

import { styled } from '@storybook/theming';
import { ScrollArea, Spaced } from '@storybook/components';
import { StoriesHash, State, isRoot } from '@storybook/api';

import { Heading } from './Heading';

import Explorer from './Explorer';
import Search from './Search';
import SearchResults from './SearchResults';
import { CombinedDataset, Selection, ItemWithRefId } from './types';

import { Refs } from './RefHelpers';

export const DEFAULT_REF_ID = 'storybook_internal';

const getLastViewedStoryIds = (): Selection[] => {
  try {
    const raw = window.localStorage.getItem('lastViewedStoryIds');
    const val = typeof raw === 'string' && JSON.parse(raw);
    if (!val || !Array.isArray(val)) return [];
    if (!val.some((item) => typeof item === 'object' && item.storyId && item.refId)) return [];
    return val;
  } catch (e) {
    return [];
  }
};
const setLastViewedStoryIds = (items: Selection[]) => {
  try {
    window.localStorage.setItem('lastViewedStoryIds', JSON.stringify(items));
  } catch (e) {
    //
  }
};

const Container = styled.nav({
  position: 'absolute',
  zIndex: 1,
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
});

const StyledSpaced = styled(Spaced)({
  paddingBottom: '2.5rem',
});

const CustomScrollArea = styled(ScrollArea)({
  '&&&&& .os-scrollbar-handle:before': {
    left: -12,
  },
  '&&&&& .os-scrollbar-vertical': {
    right: 5,
  },
  padding: 20,
});

const Swap = React.memo<{ children: React.ReactNode; condition: boolean }>(
  ({ children, condition }) => {
    const [a, b] = React.Children.toArray(children);
    return (
      <>
        <div style={{ display: condition ? 'block' : 'none' }}>{a}</div>
        <div style={{ display: condition ? 'none' : 'block' }}>{b}</div>
      </>
    );
  }
);

const useCombination = (
  stories: StoriesHash,
  ready: boolean,
  error: Error | undefined,
  refs: Refs
): CombinedDataset => {
  const hash = useMemo(
    () => ({
      [DEFAULT_REF_ID]: {
        stories,
        title: null,
        id: DEFAULT_REF_ID,
        url: 'iframe.html',
        ready,
        error,
      },
      ...refs,
    }),
    [refs, stories]
  );
  return useMemo(() => ({ hash, entries: Object.entries(hash) }), [hash]);
};

export interface SidebarProps {
  stories: StoriesHash;
  storiesConfigured: boolean;
  storiesFailed?: Error;
  refs: State['refs'];
  menu: any[];
  storyId: string;
  refId?: string;
  menuHighlighted?: boolean;
}

const Sidebar: FunctionComponent<SidebarProps> = React.memo(
  ({
    storyId,
    refId = DEFAULT_REF_ID,
    stories,
    storiesConfigured,
    storiesFailed,
    menu,
    menuHighlighted = false,
    refs = {},
  }) => {
    const selected = useMemo(() => ({ storyId, refId }), [storyId, refId]);
    const dataset = useCombination(stories, storiesConfigured, storiesFailed, refs);
    const getPath = useCallback(
      function getPath(item: ItemWithRefId): string[] {
        const ref = dataset.hash[item.refId];
        const parent = !isRoot(item) && item.parent ? ref.stories[item.parent] : null;
        if (parent) return [...getPath({ refId: item.refId, ...parent }), parent.name];
        return item.refId === DEFAULT_REF_ID ? [] : [ref.title || ref.id];
      },
      [dataset]
    );

    const [lastViewed, setLastViewed] = useState(getLastViewedStoryIds);
    const updateLastViewed = useCallback(
      (selection: Selection) =>
        setLastViewed((state: Selection[]) => {
          const index = state.findIndex(
            (item) => item.storyId === selection.storyId && item.refId === selection.refId
          );
          if (index === 0) return state;
          const update =
            index === -1
              ? [selection, ...state]
              : [selection, ...state.slice(0, index), ...state.slice(index + 1)];
          setLastViewedStoryIds(update);
          return update;
        }),
      [setLastViewed]
    );

    useEffect(() => {
      updateLastViewed(selected);
    }, [selected]);

    return (
      <Container className="container sidebar-container">
        <CustomScrollArea vertical>
          <StyledSpaced row={1.6}>
            <Heading className="sidebar-header" menuHighlighted={menuHighlighted} menu={menu} />

            <Search dataset={dataset} lastViewed={lastViewed}>
              {({
                inputValue,
                inputHasFocus,
                results,
                getMenuProps,
                getItemProps,
                highlightedIndex,
              }) => (
                <Swap condition={!!(inputHasFocus || inputValue)}>
                  <SearchResults
                    isSearching={!!inputValue}
                    results={results}
                    getPath={getPath}
                    getMenuProps={getMenuProps}
                    getItemProps={getItemProps}
                    highlightedIndex={highlightedIndex}
                  />
                  <Explorer
                    dataset={dataset}
                    selected={selected}
                    isBrowsing={!inputHasFocus && !inputValue}
                  />
                </Swap>
              )}
            </Search>
          </StyledSpaced>
        </CustomScrollArea>
      </Container>
    );
  }
);

export default Sidebar;
