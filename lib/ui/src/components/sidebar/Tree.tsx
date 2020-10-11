import { StoriesHash, isRoot, isStory } from '@storybook/api';
import { styled } from '@storybook/theming';
import { Icons } from '@storybook/components';
import { transparentize } from 'polished';
import React, { useCallback, useMemo, useRef } from 'react';

import { ComponentNode, DocumentNode, GroupNode, RootNode, StoryNode } from './TreeNode';
import { useExpanded, ExpandAction } from './useExpanded';
import { Item } from './types';
import { createId, getAncestorIds, getDescendantIds, getLink } from './utils';

export const Action = styled.button(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 21,
  height: 21,
  margin: 0,
  padding: 0,
  outline: 0,
  lineHeight: 'normal',
  background: 'none',
  border: `1px solid transparent`,
  borderRadius: '100%',
  cursor: 'pointer',
  transition: 'all 150ms ease-out',
  color:
    theme.base === 'light'
      ? transparentize(0.3, theme.color.defaultText)
      : transparentize(0.6, theme.color.defaultText),

  '&:hover': {
    color: theme.barSelectedColor,
  },
  '&:focus': {
    color: theme.barSelectedColor,
    borderColor: theme.color.secondary,
  },
  svg: {
    width: 11,
    height: 11,
  },
}));

interface NodeProps {
  item: Item;
  refId: string;
  isOrphan: boolean;
  isDisplayed: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isFullyExpanded?: boolean;
  isExpanded: boolean;
  setExpanded: (action: ExpandAction) => void;
  setFullyExpanded?: () => void;
  onSelectStoryId: (itemId: string) => void;
}

const Node = React.memo<NodeProps>(
  ({
    item,
    refId,
    isOrphan,
    isDisplayed,
    isSelected,
    isHighlighted,
    isFullyExpanded,
    setFullyExpanded,
    isExpanded,
    setExpanded,
    onSelectStoryId,
  }) => {
    if (!isDisplayed) return null;

    const id = createId(item.id, refId);
    if (isStory(item)) {
      const LeafNode = item.isComponent ? DocumentNode : StoryNode;
      return (
        <LeafNode
          key={id}
          id={id}
          data-ref-id={refId}
          data-item-id={item.id}
          data-parent-id={item.parent}
          data-nodetype={item.isComponent ? 'document' : 'story'}
          data-selected={isSelected}
          data-highlighted={isHighlighted}
          data-highlightable={isDisplayed}
          depth={isOrphan ? item.depth : item.depth - 1}
          isSelected={isSelected}
          isHighlighted={isHighlighted}
          href={getLink(item.id, refId)}
          onClick={(event) => {
            event.preventDefault();
            onSelectStoryId(item.id);
          }}
        >
          {item.name}
        </LeafNode>
      );
    }

    if (isRoot(item)) {
      return (
        <RootNode key={id} id={id} data-ref-id={refId} data-item-id={item.id} data-nodetype="root">
          {item.name}
          <Action
            type="button"
            data-action="expand-all"
            data-expanded={isFullyExpanded}
            onClick={(event) => {
              event.preventDefault();
              setFullyExpanded();
            }}
          >
            <Icons icon={isFullyExpanded ? 'collapse' : 'expandalt'} />
          </Action>
        </RootNode>
      );
    }

    const BranchNode = item.isComponent ? ComponentNode : GroupNode;
    return (
      <BranchNode
        key={id}
        id={id}
        data-ref-id={refId}
        data-item-id={item.id}
        data-parent-id={item.parent}
        data-nodetype={item.isComponent ? 'component' : 'group'}
        data-highlighted={isHighlighted}
        data-highlightable={isDisplayed}
        aria-controls={item.children && item.children[0]}
        aria-expanded={isExpanded}
        depth={isOrphan ? item.depth : item.depth - 1}
        isComponent={item.isComponent}
        isExpandable={item.children && item.children.length > 0}
        isExpanded={isExpanded}
        isHighlighted={isHighlighted}
        onClick={(event) => {
          event.preventDefault();
          setExpanded({ ids: [id], value: !isExpanded });
          if (item.isComponent && !isExpanded) onSelectStoryId(item.id);
        }}
      >
        {item.name}
      </BranchNode>
    );
  }
);

const Root = React.memo<NodeProps & { expandableDescendants: string[] }>(
  ({ setExpanded, isFullyExpanded, expandableDescendants, ...props }) => {
    const setFullyExpanded = useCallback(
      () => setExpanded({ ids: expandableDescendants, value: !isFullyExpanded }),
      [setExpanded, isFullyExpanded, expandableDescendants]
    );
    return (
      <Node
        {...props}
        setExpanded={setExpanded}
        isFullyExpanded={isFullyExpanded}
        setFullyExpanded={setFullyExpanded}
      />
    );
  }
);

const Container = styled.div<{ hasOrphans: boolean }>((props) => ({
  marginTop: props.hasOrphans ? 20 : 0,
  marginBottom: 20,
}));

export const Tree = React.memo<{
  isBrowsing: boolean;
  isMain: boolean;
  refId: string;
  data: StoriesHash;
  highlightedItemId: string | null;
  setHighlightedItemId: (itemId: string) => void;
  selectedStoryId: string | null;
  onSelectStoryId: (storyId: string) => void;
}>(
  ({
    isBrowsing,
    isMain,
    refId,
    data,
    highlightedItemId,
    setHighlightedItemId,
    selectedStoryId,
    onSelectStoryId,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Find top-level nodes and group them so we can hoist any orphans and expand any roots.
    const [rootIds, orphanIds] = useMemo(
      () =>
        Object.keys(data).reduce<[string[], string[]]>(
          (acc, id) => {
            const item = data[id];
            if (isRoot(item)) acc[0].push(id);
            else if (!item.parent) acc[1].push(id);
            return acc;
          },
          [[], []]
        ),
      [data]
    );

    // Pull up (hoist) any "orphan" items that don't have a root item as ancestor so they get
    // displayed at the top of the tree, before any root items.
    // Also create a map of expandable descendants for each root/orphan item, which is needed later.
    // Doing that here is a performance enhancement, as it avoids traversing the tree again later.
    const { orphansFirst, expandableDescendants } = useMemo(() => {
      return orphanIds
        .concat(rootIds)
        .reduce<{ orphansFirst: string[]; expandableDescendants: Record<string, string[]> }>(
          (acc, nodeId) => {
            const descendantIds = getDescendantIds(data, nodeId, false);
            acc.orphansFirst.push(nodeId, ...descendantIds);
            acc.expandableDescendants[nodeId] = descendantIds.filter((d) => !data[d].isLeaf);
            return acc;
          },
          { orphansFirst: [], expandableDescendants: {} }
        );
    }, [data, rootIds, orphanIds]);

    // Track expanded nodes, keep it in sync with props and enable keyboard shortcuts.
    const [expanded, setExpanded] = useExpanded({
      containerRef,
      isBrowsing, // only enable keyboard shortcuts when tree is visible
      refId,
      data,
      rootIds,
      highlightedItemId,
      setHighlightedItemId,
      selectedStoryId,
      onSelectStoryId,
    });

    return (
      <Container ref={containerRef} hasOrphans={isMain && orphanIds.length > 0}>
        {orphansFirst.map((itemId) => {
          const item = data[itemId];
          const id = createId(itemId, refId);

          if (isRoot(item)) {
            const descendants = expandableDescendants[item.id];
            const isFullyExpanded = descendants.every((d: string) => expanded[d]);
            return (
              <Root
                key={id}
                item={item}
                refId={refId}
                isOrphan={false}
                isDisplayed
                isSelected={selectedStoryId === itemId}
                isHighlighted={highlightedItemId === itemId}
                isExpanded={!!expanded[itemId]}
                setExpanded={setExpanded}
                isFullyExpanded={isFullyExpanded}
                expandableDescendants={descendants}
                onSelectStoryId={onSelectStoryId}
              />
            );
          }

          const isDisplayed =
            !item.parent || getAncestorIds(data, itemId).every((a: string) => expanded[a]);
          return (
            <Node
              key={id}
              item={item}
              refId={refId}
              isOrphan={orphanIds.some((oid) => itemId === oid || itemId.startsWith(`${oid}-`))}
              isDisplayed={isDisplayed}
              isSelected={selectedStoryId === itemId}
              isHighlighted={highlightedItemId === itemId}
              isExpanded={!!expanded[itemId]}
              setExpanded={setExpanded}
              onSelectStoryId={onSelectStoryId}
            />
          );
        })}
      </Container>
    );
  }
);
