import throttle from 'lodash/throttle';
import { document } from 'global';
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { CombinedDataset, Highlight, Selection } from './types';
import { cycle, isAncestor, scrollIntoView } from './utils';

export interface HighlightedProps {
  containerRef: MutableRefObject<HTMLElement>;
  isLoading: boolean;
  isBrowsing: boolean;
  dataset: CombinedDataset;
  selected: Selection;
}

const fromSelection = (selection: Selection): Highlight =>
  selection ? { itemId: selection.storyId, refId: selection.refId } : null;

export const useHighlighted = ({
  containerRef,
  isLoading,
  isBrowsing,
  dataset,
  selected,
}: HighlightedProps): [Highlight, Dispatch<SetStateAction<Highlight>>] => {
  const initialHighlight = fromSelection(selected);
  const highlightedRef = useRef<Highlight>(initialHighlight);
  const [highlighted, setHighlighted] = useState<Highlight>(initialHighlight);

  // Sets the highlighted node and scrolls it into view, using DOM elements as reference
  const highlightElement = useCallback(
    (element: Element, center = false) => {
      const itemId = element.getAttribute('data-item-id');
      const refId = element.getAttribute('data-ref-id');
      if (!itemId || !refId) return;
      highlightedRef.current = { itemId, refId };
      setHighlighted(highlightedRef.current);
      scrollIntoView(element, center);
    },
    [highlightedRef, setHighlighted]
  );

  // Highlight and scroll to the selected story whenever the selection or dataset changes
  useEffect(() => {
    const highlight = fromSelection(selected);
    setHighlighted(highlight);
    highlightedRef.current = highlight;
    if (highlight) {
      const { itemId, refId } = highlight;
      setTimeout(() => {
        scrollIntoView(
          containerRef.current.querySelector(`[data-item-id="${itemId}"][data-ref-id="${refId}"]`),
          true // make sure it's clearly visible by centering it
        );
      }, 0);
    }
  }, [dataset, highlightedRef, selected]);

  // Highlight nodes up/down the tree using arrow keys
  useEffect(() => {
    const menuElement = document.getElementById('storybook-explorer-menu');
    const navigateTree = throttle((event) => {
      if (isLoading || !isBrowsing || !event.key || !containerRef || !containerRef.current) return;
      if (event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as Element;
      if (!isAncestor(menuElement, target) && !isAncestor(target, menuElement)) return;

      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        const highlightable = Array.from(
          containerRef.current.querySelectorAll('[data-highlightable=true]')
        );
        const currentIndex = highlightable.findIndex(
          (el) =>
            el.getAttribute('data-item-id') === highlightedRef.current?.itemId &&
            el.getAttribute('data-ref-id') === highlightedRef.current?.refId
        );
        const nextIndex = cycle(highlightable, currentIndex, event.key === 'ArrowUp' ? -1 : 1);
        const didRunAround =
          (event.key === 'ArrowDown' && nextIndex === 0) ||
          (event.key === 'ArrowUp' && nextIndex === highlightable.length - 1);
        highlightElement(highlightable[nextIndex], didRunAround);
      }
    }, 30);

    document.addEventListener('keydown', navigateTree);
    return () => document.removeEventListener('keydown', navigateTree);
  }, [isLoading, isBrowsing, highlightedRef, highlightElement]);

  return [highlighted, setHighlighted];
};
