/* eslint-env browser */

import { useStorybookApi } from '@storybook/api';
import { styled } from '@storybook/theming';
import { Icons } from '@storybook/components';
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift';
import Fuse, { FuseOptions } from 'fuse.js';
import React, { useEffect, useMemo, useRef, useState, useCallback, FunctionComponent } from 'react';

import { Refs, RefType } from './RefHelpers';
import {
  ItemWithRefId,
  RawSearchresults,
  DownshiftItem,
  SearchChildrenFn,
  Selection,
  isSearchResult,
  isExpandType,
} from './types';
import { DEFAULT_REF_ID } from './utils';

const options = {
  shouldSort: true,
  tokenize: true,
  findAllMatches: true,
  includeScore: true,
  includeMatches: true,
  threshold: 0.3,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: ['name'],
} as FuseOptions<ItemWithRefId>;

const ScreenReaderLabel = styled.label({
  position: 'absolute',
  left: -10000,
  top: 'auto',
  width: 1,
  height: 1,
  overflow: 'hidden',
});

const SearchIcon = styled(Icons)(({ theme }) => ({
  width: 12,
  height: 12,
  position: 'absolute',
  top: 8,
  left: 10,
  zIndex: 1,
  pointerEvents: 'none',
  color: theme.color.mediumdark,
}));

const SearchField = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '&:focus-within svg': {
    color: theme.color.defaultText,
  },
}));

const Input = styled.input(({ theme }) => ({
  height: 28,
  paddingLeft: 28,
  paddingRight: 28,
  border: `1px solid ${theme.appBorderColor}`,
  background: 'transparent',
  borderRadius: 28,
  fontSize: `${theme.typography.size.s1}px`,
  fontFamily: 'inherit',
  transition: 'all 150ms',
  color: theme.color.defaultText,
  '&:focus, &:active': {
    outline: 0,
    borderColor: theme.color.secondary,
    background: theme.barBg,
  },
  '&::placeholder': {
    color: theme.color.mediumdark,
  },
  '&:valid ~ code, &:focus ~ code': {
    display: 'none',
  },
  '&:invalid ~ svg': {
    display: 'none',
  },
  '&:valid ~ svg': {
    display: 'block',
  },
  '&::-ms-clear': {
    display: 'none',
  },
  '&::-webkit-search-decoration, &::-webkit-search-cancel-button, &::-webkit-search-results-button, &::-webkit-search-results-decoration': {
    display: 'none',
  },
}));

const FocusKey = styled.code(({ theme }) => ({
  position: 'absolute',
  top: 6,
  right: 12,
  width: 16,
  height: 16,
  zIndex: 1,
  lineHeight: '17px',
  textAlign: 'center',
  fontSize: '11px',
  background: 'rgba(0,0,0,0.1)',
  color: theme.color.mediumdark,
  borderRadius: 2,
  userSelect: 'none',
  pointerEvents: 'none',
}));

const ClearIcon = styled(Icons)(({ theme }) => ({
  width: 16,
  height: 16,
  padding: 4,
  position: 'absolute',
  top: 6,
  right: 12,
  zIndex: 1,
  background: 'rgba(0,0,0,0.1)',
  borderRadius: 16,
  color: theme.color.darker,
  cursor: 'pointer',
}));

const FocusContainer = styled.div({ outline: 0 });

const Search: FunctionComponent<{
  children: SearchChildrenFn;
  dataset: { hash: Refs; entries: [string, RefType][] };
  lastViewed?: Selection[];
  initialQuery?: string;
}> = ({ children, dataset, lastViewed = [], initialQuery = '' }) => {
  const api = useStorybookApi();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputPlaceholder, setPlaceholder] = useState('Find components');
  const [allComponents, showAllComponents] = useState(false);

  const selectStory = useCallback(
    (id: string, refId: string) => {
      if (api) api.selectStory(id, undefined, { ref: refId !== DEFAULT_REF_ID && refId });
      inputRef.current.blur();
      showAllComponents(false);
    },
    [api, inputRef, showAllComponents, DEFAULT_REF_ID]
  );

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (!inputRef.current) return;
      if (event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === '/' && inputRef.current !== document.activeElement) {
        inputRef.current.focus();
        event.preventDefault();
      }
    };

    // Keyup prevents slashes from ending up in the input field when held down
    document.addEventListener('keyup', focusSearch);
    return () => document.removeEventListener('keyup', focusSearch);
  }, [inputRef]);

  const list: ItemWithRefId[] = useMemo(
    () =>
      dataset.entries.reduce((acc: ItemWithRefId[], [refId, { stories }]) => {
        if (stories) acc.push(...Object.values(stories).map((item) => ({ ...item, refId })));
        return acc;
      }, []),
    [dataset]
  );
  const fuse = useMemo(() => new Fuse(list, options), [list]);

  const getResults = useCallback(
    (input: string) => {
      if (!input) return [];

      let results: DownshiftItem[] = [];
      const componentResults = (fuse.search(input) as RawSearchresults).filter(
        ({ item }) => item.isComponent
      );

      if (componentResults.length) {
        results = componentResults.slice(0, allComponents ? 100 : 10);
        if (componentResults.length > 10 && !allComponents) {
          results.push({
            showAll: () => showAllComponents(true),
            totalCount: componentResults.length,
          });
        }
      }

      return results;
    },
    [allComponents, fuse]
  );

  const stateReducer = useCallback(
    (state: DownshiftState<DownshiftItem>, changes: StateChangeOptions<DownshiftItem>) => {
      const { blurInput, clickItem, keyDownEnter, keyDownEscape } = Downshift.stateChangeTypes;
      const { type, inputValue, selectedItem = {} } = changes;
      if (type === blurInput) return {};
      if (type === keyDownEscape) {
        inputRef.current.blur();
        showAllComponents(false);
        return { inputValue: '' };
      }
      if (type === clickItem || type === keyDownEnter) {
        if (isSearchResult(selectedItem)) {
          const { id, refId } = selectedItem.item;
          selectStory(id, refId);
          return { inputValue: '' };
        }
        if (isExpandType(selectedItem)) {
          selectedItem.showAll();
          return {};
        }
      }
      if (inputValue === '') {
        showAllComponents(false);
      }
      return changes;
    },
    [inputRef, selectStory, showAllComponents]
  );

  return (
    <Downshift<DownshiftItem>
      initialInputValue={initialQuery}
      stateReducer={stateReducer}
      itemToString={(result) => {
        // @ts-ignore
        return result?.item?.name || '';
      }}
    >
      {({
        inputValue,
        clearSelection,
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        getRootProps,
        highlightedIndex,
      }) => {
        const input = inputValue ? inputValue.trim() : '';
        let results: DownshiftItem[] = input ? getResults(input) : [];

        if (!input && lastViewed.length) {
          results = lastViewed.reduce((acc, { storyId, refId }) => {
            const data = dataset.hash[refId];
            if (data && data.stories && data.stories[storyId]) {
              const story = data.stories[storyId];
              const item =
                story.isLeaf && !story.isComponent && !story.isRoot
                  ? { refId, ...data.stories[story.parent] }
                  : { refId, ...story };
              if (!acc.some((res) => res.item.refId === item.refId && res.item.id === item.id)) {
                acc.push({ item, matches: [], score: 0 });
              }
            }
            return acc;
          }, []);
        }

        const inputProps = getInputProps({
          ref: inputRef,
          required: true,
          type: 'search',
          placeholder: inputPlaceholder,
          onFocus: () => setPlaceholder('Type to find...'),
          onBlur: () => setPlaceholder('Find components'),
        });

        return (
          <>
            <ScreenReaderLabel {...getLabelProps()}>Search for components</ScreenReaderLabel>
            <SearchField {...getRootProps({ refKey: '' }, { suppressRefError: true })}>
              <SearchIcon icon="search" />
              <Input {...inputProps} />
              <FocusKey>/</FocusKey>
              <ClearIcon icon="cross" onClick={() => clearSelection()} />
            </SearchField>
            <FocusContainer tabIndex={0}>
              {children({
                inputValue: input,
                results,
                inputHasFocus: document.activeElement === inputRef.current,
                getMenuProps,
                getItemProps,
                highlightedIndex,
              })}
            </FocusContainer>
          </>
        );
      }}
    </Downshift>
  );
};

export default Search;
