/* eslint-env browser */

import { StoriesHash, isRoot, isStory } from '@storybook/api';
import { styled } from '@storybook/theming';
import { Icons } from '@storybook/components';
import { transparentize } from 'polished';
import throttle from 'lodash/throttle';
import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

import { getParents } from './old/utils';
import { ComponentNode, DocumentNode, GroupNode, RootNode, StoryNode } from './TreeNode';
import { Item } from './types';

export const getAncestorIds = (data: StoriesHash, id: string): string[] =>
  getParents(id, data).map((item) => item.id);

export const getDescendantIds = (data: StoriesHash, id: string, skipLeafs = false): string[] => {
  const { children = [] } = data[id] || {};
  return children.reduce((acc, childId) => {
    if (skipLeafs && data[childId].isLeaf) return acc;
    acc.push(childId, ...getDescendantIds(data, childId, skipLeafs));
    return acc;
  }, []);
};

type ExpandedState = Record<string, boolean>;
interface ExpandAction {
  ids: string[];
  value: boolean;
}
const initializeExpanded = ({
  data,
  highlightedId,
  roots,
}: {
  data: StoriesHash;
  highlightedId?: string;
  roots: string[];
}) => {
  const highlightedAncestors = highlightedId ? getAncestorIds(data, highlightedId) : [];
  return [...roots, ...highlightedAncestors].reduce<ExpandedState>(
    (acc, id) => Object.assign(acc, { [id]: true }),
    {}
  );
};

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
          href={`?path=/story/${node.id}`}
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
    const nodeIds = useMemo(() => Object.keys(data), [data]);
    const [roots, orphans] = useMemo(
      () =>
        nodeIds.reduce<[string[], string[]]>(
          (acc, id) => {
            const node = data[id];
            if (isRoot(node)) acc[0].push(id);
            else if (!node.parent) acc[1].push(id);
            return acc;
          },
          [[], []]
        ),
      [data, nodeIds]
    );
    const { orphansFirst, expandableDescendants } = useMemo(() => {
      return orphans
        .concat(roots)
        .reduce<{ orphansFirst: string[]; expandableDescendants: Record<string, string[]> }>(
          (acc, id) => {
            const descendantIds = getDescendantIds(data, id);
            acc.orphansFirst.push(id, ...descendantIds);
            acc.expandableDescendants[id] = descendantIds.filter((d) => !data[d].isLeaf);
            return acc;
          },
          { orphansFirst: [], expandableDescendants: {} }
        );
    }, [data, roots, orphans]);

    const [expanded, setExpanded] = useReducer<
      React.Reducer<ExpandedState, ExpandAction>,
      { data: StoriesHash; highlightedId?: string; roots: string[] }
    >(
      (state, { ids, value }) =>
        ids.reduce((acc, id) => Object.assign(acc, { [id]: value }), { ...state }),
      { data, highlightedId, roots },
      initializeExpanded
    );

    useEffect(() => {
      setExpanded({ ids: getAncestorIds(data, selectedId), value: true });
    }, [data, selectedId]);

    const rootRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const getElementByDataId = (id: string) =>
        rootRef.current && rootRef.current.querySelector(`[data-id="${id}"]`);

      const highlightElement = (element: Element) => {
        setHighlightedId(element.getAttribute('data-id'));
        const { top, bottom } = element.getBoundingClientRect();
        const inView =
          top >= 0 && bottom <= (window.innerHeight || document.documentElement.clientHeight);
        if (!inView) element.scrollIntoView({ block: 'nearest' });
      };

      const navigateTree = throttle((event) => {
        if (!isBrowsing || !event.key || !rootRef || !rootRef.current || !highlightedId) return;
        if (event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;
        if (!['Enter', ' ', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();

        const highlightedElement = getElementByDataId(highlightedId);
        if (!highlightedElement || highlightedElement.getAttribute('data-ref') !== refId) return;
        const type = highlightedElement.getAttribute('data-nodetype');

        if (
          ['Enter', ' '].includes(event.key) &&
          ['component', 'story', 'document'].includes(type)
        ) {
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
    }, [data, isBrowsing, highlightedId, setHighlightedId]);

    return (
      <Container ref={rootRef} hasOrphans={isMain && orphans.length > 0}>
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
              isOrphan={orphans.some((oid) => id === oid || id.startsWith(`${oid}-`))}
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
