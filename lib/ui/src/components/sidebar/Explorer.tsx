import React, { FunctionComponent, useRef } from 'react';
import { Global } from '@storybook/theming';

import { Ref } from './Refs';
import { CombinedDataset, Selection } from './types';
import { useHighlighted } from './useHighlighted';

export interface ExplorerProps {
  isLoading: boolean;
  isBrowsing: boolean;
  dataset: CombinedDataset;
  selected: Selection;
}

export const Explorer: FunctionComponent<ExplorerProps> = React.memo(
  ({ isLoading, isBrowsing, dataset, selected }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track highlighted nodes, keep it in sync with props and enable keyboard navigation
    const [highlighted, setHighlighted, highlightedRef] = useHighlighted({
      containerRef,
      isLoading, // only enable keyboard navigation when ready
      isBrowsing, // only enable keyboard navigation when tree is visible
      dataset,
      selected,
    });

    return (
      <div
        ref={containerRef}
        id="storybook-explorer-tree"
        data-highlighted-ref-id={highlighted?.refId}
        data-highlighted-item-id={highlighted?.itemId}
      >
        {highlighted && (
          <Global
            styles={(theme) => ({
              [`[data-ref-id="${highlighted.refId}"][data-item-id="${highlighted.itemId}"]:not([data-selected="true"])`]: {
                [`&[data-nodetype="component"], &[data-nodetype="group"]`]: {
                  background: `${theme.color.secondary}22`,
                  '&:hover, &:focus': {
                    background: `${theme.color.secondary}22`,
                  },
                },
                [`&[data-nodetype="story"], &[data-nodetype="document"]`]: {
                  color: theme.color.defaultText,
                  background: `${theme.color.secondary}22`,
                  '&:hover, &:focus': { background: `${theme.color.secondary}22` },
                },
              },
            })}
          />
        )}
        {dataset.entries.map(([refId, ref]) => (
          <Ref
            {...ref}
            key={refId}
            isLoading={isLoading}
            isBrowsing={isBrowsing}
            selectedStoryId={selected?.refId === ref.id ? selected.storyId : null}
            highlightedRef={highlightedRef}
            setHighlighted={setHighlighted}
          />
        ))}
      </div>
    );
  }
);
