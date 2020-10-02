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

import { CombinedDataset, Selection } from './types';
import { cycle, scrollIntoView } from './utils';

export interface HighlightedProps {
  containerRef: MutableRefObject<HTMLElement>;
  isBrowsing: boolean;
  dataset: CombinedDataset;
  selected: Selection;
}

export const useHighlighted = ({
  containerRef,
  isBrowsing,
  dataset,
  selected,
}: HighlightedProps): [Selection, Dispatch<SetStateAction<Selection>>] => {
  const highlightedRef = useRef<Selection>(selected);
  const [highlighted, setHighlighted] = useState<Selection>(selected);

  // Sets the highlighted node and scrolls it into view, using DOM elements as reference
  const highlightElement = useCallback(
    (element: Element, center = false) => {
      const storyId = element.getAttribute('data-id');
      const refId = element.getAttribute('data-ref');
      if (!storyId || !refId) return;
      highlightedRef.current = { storyId, refId };
      setHighlighted(highlightedRef.current);
      scrollIntoView(element, center);
    },
    [highlightedRef, setHighlighted]
  );

  // Highlight and scroll to the selected story whenever the selection or dataset changes
  useEffect(() => {
    setHighlighted(selected);
    highlightedRef.current = selected;
    if (selected) {
      const { storyId, refId } = selected;
      setTimeout(() => {
        scrollIntoView(
          containerRef.current.querySelector(`[data-id="${storyId}"][data-ref="${refId}"]`),
          true // make sure it's clearly visible by centering it
        );
      }, 0);
    }
  }, [dataset, highlightedRef, selected]);

  // Highlight nodes up/down the tree using arrow keys
  useEffect(() => {
    const navigateTree = throttle((event) => {
      if (!isBrowsing || !event.key || !containerRef || !containerRef.current) return;
      if (event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        const highlightable = Array.from(
          containerRef.current.querySelectorAll('[data-highlightable=true]')
        );
        const currentIndex = highlightable.findIndex(
          (el) =>
            el.getAttribute('data-id') === highlightedRef.current?.storyId &&
            el.getAttribute('data-ref') === highlightedRef.current?.refId
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
  }, [isBrowsing, highlightedRef, highlightElement]);

  return [highlighted, setHighlighted];
};
