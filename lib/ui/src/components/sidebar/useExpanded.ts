import { StoriesHash } from '@storybook/api';
import { document } from 'global';
import throttle from 'lodash/throttle';
import React, { Dispatch, MutableRefObject, useCallback, useEffect, useReducer } from 'react';

import { isAncestor, getAncestorIds, getDescendantIds, scrollIntoView } from './utils';

export type ExpandedState = Record<string, boolean>;

export interface ExpandAction {
  ids: string[];
  value: boolean;
}

export interface ExpandedProps {
  containerRef: MutableRefObject<HTMLElement>;
  isBrowsing: boolean;
  refId: string;
  data: StoriesHash;
  rootIds: string[];
  highlightedItemId: string | null;
  setHighlightedItemId: (storyId: string) => void;
  selectedStoryId: string | null;
  onSelectStoryId: (storyId: string) => void;
}

const initializeExpanded = ({
  data,
  highlightedItemId,
  rootIds,
}: {
  data: StoriesHash;
  highlightedItemId: string | null;
  rootIds: string[];
}) => {
  const highlightedAncestors = highlightedItemId ? getAncestorIds(data, highlightedItemId) : [];
  return [...rootIds, ...highlightedAncestors].reduce<ExpandedState>(
    (acc, id) => Object.assign(acc, { [id]: true }),
    {}
  );
};

export const useExpanded = ({
  containerRef,
  isBrowsing,
  refId,
  data,
  rootIds,
  highlightedItemId,
  setHighlightedItemId,
  selectedStoryId,
  onSelectStoryId,
}: ExpandedProps): [Record<string, boolean>, Dispatch<ExpandAction>] => {
  // Track the set of currently expanded nodes within this tree.
  // Root nodes are expanded by default (and cannot be collapsed).
  const [expanded, setExpanded] = useReducer<
    React.Reducer<ExpandedState, ExpandAction>,
    { data: StoriesHash; highlightedItemId: string | null; rootIds: string[] }
  >(
    (state, { ids, value }) =>
      ids.reduce((acc, id) => Object.assign(acc, { [id]: value }), { ...state }),
    { data, highlightedItemId, rootIds },
    initializeExpanded
  );

  const getElementByDataItemId = useCallback(
    (id: string) =>
      containerRef.current && containerRef.current.querySelector(`[data-item-id="${id}"]`),
    [containerRef]
  );

  const highlightElement = useCallback(
    (element: Element) => {
      setHighlightedItemId(element.getAttribute('data-item-id'));
      scrollIntoView(element);
    },
    [setHighlightedItemId]
  );

  // Expand the whole ancestry of the currently selected story whenever it changes.
  useEffect(() => {
    setExpanded({ ids: getAncestorIds(data, selectedStoryId), value: true });
  }, [data, selectedStoryId]);

  // Expand, collapse or select nodes in the tree using keyboard shortcuts.
  useEffect(() => {
    const menuElement = document.getElementById('storybook-explorer-menu');
    const navigateTree = throttle((event: KeyboardEvent) => {
      if (!isBrowsing || !event.key || !containerRef.current || !highlightedItemId) return;
      if (event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;
      if (!['Enter', ' ', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;

      const highlightedElement = getElementByDataItemId(highlightedItemId);
      if (!highlightedElement || highlightedElement.getAttribute('data-ref-id') !== refId) return;

      const target = event.target as Element;
      if (!isAncestor(menuElement, target) && !isAncestor(target, menuElement)) return;
      if (target.hasAttribute('data-action')) {
        if (['Enter', ' '].includes(event.key)) return;
        (target as HTMLButtonElement).blur();
      }

      event.preventDefault();

      const type = highlightedElement.getAttribute('data-nodetype');
      if (['Enter', ' '].includes(event.key) && ['component', 'story', 'document'].includes(type)) {
        onSelectStoryId(highlightedItemId);
      }

      const isExpanded = highlightedElement.getAttribute('aria-expanded');

      if (event.key === 'ArrowLeft') {
        if (isExpanded === 'true') {
          // The highlighted node is expanded, so we collapse it.
          setExpanded({ ids: [highlightedItemId], value: false });
          return;
        }

        const parentId = highlightedElement.getAttribute('data-parent-id');
        const parentElement = parentId && getElementByDataItemId(parentId);
        if (parentElement && parentElement.getAttribute('data-highlightable') === 'true') {
          // The highlighted node isn't expanded, so we move the highlight to its parent instead.
          highlightElement(parentElement);
          return;
        }

        // The parent can't be highlighted, which means it must be a root.
        // The highlighted node is already collapsed, so we collapse its descendants.
        setExpanded({ ids: getDescendantIds(data, highlightedItemId, true), value: false });
        return;
      }

      if (event.key === 'ArrowRight') {
        if (isExpanded === 'false') {
          setExpanded({ ids: [highlightedItemId], value: true });
        } else if (isExpanded === 'true') {
          setExpanded({ ids: getDescendantIds(data, highlightedItemId, true), value: true });
        }
      }
    }, 16);

    document.addEventListener('keydown', navigateTree);
    return () => document.removeEventListener('keydown', navigateTree);
  }, [
    containerRef,
    isBrowsing,
    refId,
    data,
    highlightedItemId,
    setHighlightedItemId,
    onSelectStoryId,
  ]);

  const updateExpanded = useCallback(
    ({ ids, value }) => {
      setExpanded({ ids, value });
      if (ids.length === 1) setHighlightedItemId(ids[0]);
    },
    [setHighlightedItemId]
  );

  return [expanded, updateExpanded];
};
