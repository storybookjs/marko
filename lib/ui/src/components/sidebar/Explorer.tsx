import React, { FunctionComponent, useRef } from 'react';

import { Ref } from './Refs';
import { CombinedDataset, Selection } from './types';
import { useHighlighted } from './useHighlighted';

export interface ExplorerProps {
  dataset: CombinedDataset;
  selected: Selection;
  isBrowsing: boolean;
}

export const Explorer: FunctionComponent<ExplorerProps> = React.memo(
  ({ isBrowsing, dataset, selected }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track highlighted nodes, keep it in sync with props and enable keyboard navigation
    const [highlighted, setHighlighted] = useHighlighted({
      containerRef,
      isBrowsing, // only enable keyboard navigation when tree is visible
      dataset,
      selected,
    });

    return (
      <div ref={containerRef}>
        {dataset.entries.map(([refId, ref]) => (
          <Ref
            {...ref}
            key={refId}
            isBrowsing={isBrowsing}
            selectedStoryId={selected?.refId === ref.id ? selected.storyId : null}
            highlightedItemId={highlighted?.refId === ref.id ? highlighted.itemId : null}
            setHighlighted={setHighlighted}
          />
        ))}
      </div>
    );
  }
);
