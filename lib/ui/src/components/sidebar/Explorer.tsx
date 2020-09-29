/* eslint-env browser */

import React, { FunctionComponent, useEffect, useRef, useState, useCallback } from 'react';

import throttle from 'lodash/throttle';

import { Ref } from './Refs';
import { CombinedDataset, Selection } from './types';

function cycleArray<T>(array: T[], index: number, delta: number): T {
  let next = index + (delta % array.length);
  if (next < 0) next = array.length + next;
  if (next >= array.length) next -= array.length;
  return array[next];
}

const scrollIntoView = (
  element: Element,
  options: ScrollIntoViewOptions = { block: 'nearest' }
) => {
  if (!element) return;
  setTimeout(() => {
    const { top, bottom } = element.getBoundingClientRect();
    const isInView =
      top >= 0 && bottom <= (window.innerHeight || document.documentElement.clientHeight);
    if (!isInView) element.scrollIntoView(options);
  }, 0);
};

interface ExplorerProps {
  dataset: CombinedDataset;
  selected: Selection;
  isBrowsing: boolean;
}

const Explorer: FunctionComponent<ExplorerProps> = React.memo(
  ({ dataset, selected, isBrowsing }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const highlightedRef = useRef<Selection>(selected);

    const [highlighted, setHighlighted] = useState<Selection>(selected);
    const highlightElement = useCallback(
      (element: Element) => {
        const selection = {
          storyId: element.getAttribute('data-id'),
          refId: element.getAttribute('data-ref'),
        };
        scrollIntoView(element);
        setHighlighted(selection);
        highlightedRef.current = selection;
      },
      [setHighlighted]
    );

    useEffect(() => {
      const { storyId, refId } = selected;
      const element = rootRef.current.querySelector(`[data-id="${storyId}"][data-ref="${refId}"]`);
      scrollIntoView(element, { block: 'center' });
      setHighlighted(selected);
      highlightedRef.current = selected;
    }, [dataset, highlightedRef, selected]); // dataset is needed here

    useEffect(() => {
      const navigateTree = throttle((event) => {
        if (!isBrowsing || !event.key || !rootRef || !rootRef.current) return;
        if (event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault();
          const focusable = Array.from(
            rootRef.current.querySelectorAll('[data-highlightable=true]')
          );
          const focusedIndex = focusable.findIndex(
            (el) =>
              el.getAttribute('data-id') === highlightedRef.current.storyId &&
              el.getAttribute('data-ref') === highlightedRef.current.refId
          );
          highlightElement(cycleArray(focusable, focusedIndex, event.key === 'ArrowUp' ? -1 : 1));
        }
      }, 16);

      document.addEventListener('keydown', navigateTree);
      return () => document.removeEventListener('keydown', navigateTree);
    }, [isBrowsing, highlightedRef, highlightElement]);

    return (
      <div ref={rootRef}>
        {dataset.entries.map(([refId, ref]) => (
          <Ref
            {...ref}
            key={refId}
            isBrowsing={isBrowsing}
            selectedId={selected.refId === ref.id ? selected.storyId : null}
            highlightedId={highlighted.refId === ref.id ? highlighted.storyId : null}
            setHighlighted={setHighlighted}
          />
        ))}
      </div>
    );
  }
);

export default Explorer;
