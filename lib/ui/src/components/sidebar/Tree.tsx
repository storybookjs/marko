import { StoriesHash, isRoot, isStory } from '@storybook/api';
import { styled } from '@storybook/theming';
import { Icons } from '@storybook/components';
import { transparentize } from 'polished';
import React, { useCallback, useMemo, useRef } from 'react';

import { ComponentNode, DocumentNode, GroupNode, RootNode, StoryNode } from './TreeNode';
import { useExpanded, ExpandAction } from './useExpanded';
import { Item } from './types';
import { getAncestorIds, getDescendantIds, storyLink } from './utils';

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
  refId: string;
  node: Item;
  isOrphan: boolean;
  isDisplayed: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isFullyExpanded?: boolean;
  isExpanded: boolean;
  setExpanded: (action: ExpandAction) => void;
  setFullyExpanded?: () => void;
  onSelectId: (id: string) => void;
}

const Node = React.memo<NodeProps>(
  ({
    refId,
    node,
    isOrphan,
    isDisplayed,
    isSelected,
    isHighlighted,
    isFullyExpanded,
    setFullyExpanded,
    isExpanded,
    setExpanded,
    onSelectId,
  }) => {
    if (!isDisplayed) return null;
    if (isStory(node)) {
      const LeafNode = node.isComponent ? DocumentNode : StoryNode;
      return (
        <LeafNode
          href={storyLink(node.id, refId)}
          key={node.id}
          data-id={node.id}
          data-ref={refId}
          data-parent={node.parent}
          data-nodetype={node.isComponent ? 'document' : 'story'}
          data-highlightable={isDisplayed}
          depth={isOrphan ? node.depth : node.depth - 1}
          isSelected={isSelected}
          isHighlighted={isHighlighted}
          onClick={(event) => {
            event.preventDefault();
            onSelectId(node.id);
          }}
        >
          {node.name}
        </LeafNode>
      );
    }
    if (isRoot(node)) {
      return (
        <RootNode key={node.id} data-id={node.id} data-ref={refId} data-nodetype="root">
          {node.name}
          <Action
            type="button"
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
    const BranchNode = node.isComponent ? ComponentNode : GroupNode;
    return (
      <BranchNode
        key={node.id}
        data-id={node.id}
        data-ref={refId}
        data-parent={node.parent}
        data-nodetype={node.isComponent ? 'component' : 'group'}
        data-highlightable={isDisplayed}
        aria-controls={`collapsible__${node.id}`}
        aria-expanded={isExpanded}
        depth={isOrphan ? node.depth : node.depth - 1}
        isComponent={node.isComponent}
        isExpandable={node.children && node.children.length > 0}
        isExpanded={isExpanded}
        isHighlighted={isHighlighted}
        onClick={(event) => {
          event.preventDefault();
          setExpanded({ ids: [node.id], value: !isExpanded });
        }}
      >
        {node.name}
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

const Tree = React.memo<{
  isBrowsing: boolean;
  isMain: boolean;
  refId: string;
  data: StoriesHash;
  highlightedId: string | null;
  setHighlightedId: (id: string) => void;
  selectedId: string | null;
  onSelectId: (id: string) => void;
}>(
  ({
    isBrowsing,
    isMain,
    refId,
    data,
    highlightedId,
    setHighlightedId,
    selectedId,
    onSelectId,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Find top-level nodes and group them so we can hoist any orphans and expand any roots.
    const [rootIds, orphanIds] = useMemo(
      () =>
        Object.keys(data).reduce<[string[], string[]]>(
          (acc, id) => {
            const node = data[id];
            if (isRoot(node)) acc[0].push(id);
            else if (!node.parent) acc[1].push(id);
            return acc;
          },
          [[], []]
        ),
      [data]
    );

    // Pull up (hoist) any "orphan" nodes that don't have a root node as ancestor so they get
    // displayed at the top of the tree, before any root nodes.
    // Also create a map of expandable descendants for each root/orphan node, which is needed later.
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
      highlightedId,
      setHighlightedId,
      selectedId,
      onSelectId,
    });

    return (
      <Container ref={containerRef} hasOrphans={isMain && orphanIds.length > 0}>
        {orphansFirst.map((id) => {
          const node = data[id];

          if (isRoot(node)) {
            const descendants = expandableDescendants[node.id];
            const isFullyExpanded = descendants.every((d: string) => expanded[d]);
            return (
              <Root
                key={id}
                refId={refId}
                node={node}
                isOrphan={false}
                isDisplayed
                isSelected={selectedId === id}
                isHighlighted={highlightedId === id}
                isExpanded={!!expanded[id]}
                setExpanded={setExpanded}
                isFullyExpanded={isFullyExpanded}
                expandableDescendants={descendants}
                onSelectId={onSelectId}
              />
            );
          }

          const isDisplayed =
            !node.parent || getAncestorIds(data, node.id).every((a: string) => expanded[a]);
          return (
            <Node
              key={id}
              refId={refId}
              node={node}
              isOrphan={orphanIds.some((oid) => id === oid || id.startsWith(`${oid}-`))}
              isDisplayed={isDisplayed}
              isSelected={selectedId === id}
              isHighlighted={highlightedId === id}
              isExpanded={!!expanded[id]}
              setExpanded={setExpanded}
              onSelectId={onSelectId}
            />
          );
        })}
      </Container>
    );
  }
);

export default Tree;
