import { StoriesHash } from '@storybook/api';
import { document } from 'global';
import throttle from 'lodash/throttle';
import React, { Dispatch, MutableRefObject, useCallback, useEffect, useReducer } from 'react';

import { getAncestorIds, getDescendantIds, scrollIntoView } from './utils';

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
  highlightedId: string | null;
  setHighlightedId: (id: string) => void;
  selectedId: string | null;
  onSelectId: (id: string) => void;
}

const initializeExpanded = ({
  data,
  highlightedId,
  rootIds,
}: {
  data: StoriesHash;
  highlightedId: string | null;
  rootIds: string[];
}) => {
  const highlightedAncestors = highlightedId ? getAncestorIds(data, highlightedId) : [];
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
  highlightedId,
  setHighlightedId,
  selectedId,
  onSelectId,
}: ExpandedProps): [Record<string, boolean>, Dispatch<ExpandAction>] => {
  // Track the set of currently expanded nodes within this tree.
  // Root nodes are expanded by default (and cannot be collapsed).
  const [expanded, setExpanded] = useReducer<
    React.Reducer<ExpandedState, ExpandAction>,
    { data: StoriesHash; highlightedId: string | null; rootIds: string[] }
  >(
    (state, { ids, value }) =>
      ids.reduce((acc, id) => Object.assign(acc, { [id]: value }), { ...state }),
    { data, highlightedId, rootIds },
    initializeExpanded
  );

  const getElementByDataId = useCallback(
    (id: string) => containerRef.current && containerRef.current.querySelector(`[data-id="${id}"]`),
    [containerRef]
  );

  const highlightElement = useCallback(
    (element: Element) => {
      setHighlightedId(element.getAttribute('data-id'));
      scrollIntoView(element);
    },
    [setHighlightedId]
  );

  // Expand the whole ancestry of the currently selected story whenever it changes.
  useEffect(() => {
    setExpanded({ ids: getAncestorIds(data, selectedId), value: true });
  }, [data, selectedId]);

  // Expand, collapse or select nodes in the tree using keyboard shortcuts.
  useEffect(() => {
    const navigateTree = throttle((event) => {
      if (!isBrowsing || !event.key || !containerRef.current || !highlightedId) return;
      if (event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;
      if (!['Enter', ' ', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();

      const highlightedElement = getElementByDataId(highlightedId);
      if (!highlightedElement || highlightedElement.getAttribute('data-ref') !== refId) return;
      const type = highlightedElement.getAttribute('data-nodetype');

      if (['Enter', ' '].includes(event.key) && ['component', 'story', 'document'].includes(type)) {
        onSelectId(highlightedId);
      }

      const isExpanded = highlightedElement.getAttribute('aria-expanded');

      if (event.key === 'ArrowLeft') {
        if (isExpanded === 'true') {
          setExpanded({ ids: [highlightedId], value: false });
        } else {
          const parentId = highlightedElement.getAttribute('data-parent');
          if (!parentId) return;
          const parentElement = getElementByDataId(parentId);
          if (parentElement && parentElement.getAttribute('data-highlightable') === 'true') {
            setExpanded({ ids: [parentId], value: false });
            highlightElement(parentElement);
          } else {
            setExpanded({
              ids: getDescendantIds(data, parentId, true),
              value: false,
            });
          }
        }
      }

      if (event.key === 'ArrowRight') {
        if (isExpanded === 'false') {
          setExpanded({ ids: [highlightedId], value: true });
        } else if (isExpanded === 'true') {
          setExpanded({ ids: getDescendantIds(data, highlightedId, true), value: true });
        }
      }
    }, 16);

    document.addEventListener('keydown', navigateTree);
    return () => document.removeEventListener('keydown', navigateTree);
  }, [containerRef, isBrowsing, refId, data, highlightedId, setHighlightedId, onSelectId]);

  return [expanded, setExpanded];
};
