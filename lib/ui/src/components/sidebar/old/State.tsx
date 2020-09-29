import { DOCS_MODE } from 'global';
import React, { useMemo, useState, useEffect } from 'react';
import { isRoot as isRootFn, Story, StoriesHash } from '@storybook/api';
import { toFiltered, getMains, getParents } from './utils';
import { BooleanSet, FilteredType, Item, DataSet } from '../RefHelpers';

export type ItemType = StoriesHash[keyof StoriesHash];

export const collapseAllStories = (stories: StoriesHash) => {
  // keep track of component IDs that have been rewritten to the ID of their first leaf child
  const componentIdToLeafId: Record<string, string> = {};

  // 1) remove all leaves
  const leavesRemoved = Object.values(stories).filter(
    (item) => !(item.isLeaf && stories[item.parent].isComponent)
  );

  // 2) make all components leaves and rewrite their ID's to the first leaf child
  const componentsFlattened = leavesRemoved.map((item) => {
    const { id, isComponent, isRoot, children, ...rest } = item;

    // this is a folder, so just leave it alone
    if (!isComponent) {
      return item;
    }

    const nonLeafChildren: string[] = [];
    const leafChildren: string[] = [];
    children.forEach((child) =>
      (stories[child].isLeaf ? leafChildren : nonLeafChildren).push(child)
    );

    if (leafChildren.length === 0) {
      return item; // pass through, we'll handle you later
    }

    const leafId = leafChildren[0];
    const component = {
      ...rest,
      id: leafId,
      kind: (stories[leafId] as Story).kind,
      isRoot: false,
      isLeaf: true,
      isComponent: true,
      children: [] as string[],
    };
    componentIdToLeafId[id] = leafId;

    // this is a component, so it should not have any non-leaf children
    if (nonLeafChildren.length !== 0) {
      throw new Error(
        `Unexpected '${item.id}': ${JSON.stringify({ isComponent, nonLeafChildren })}`
      );
    }

    return component;
  });

  // 3) rewrite all the children as needed
  const childrenRewritten = componentsFlattened.map((item) => {
    if (item.isLeaf) {
      return item;
    }

    const { children, ...rest } = item;
    const rewritten = children.map((child) => componentIdToLeafId[child] || child);

    return { children: rewritten, ...rest };
  });

  const result = {} as StoriesHash;
  childrenRewritten.forEach((item) => {
    result[item.id] = item as Item;
  });
  return result;
};

export const collapseDocsOnlyStories = (storiesHash: StoriesHash) => {
  // keep track of component IDs that have been rewritten to the ID of their first leaf child
  const componentIdToLeafId: Record<string, string> = {};
  const docsOnlyStoriesRemoved = Object.values(storiesHash).filter((item) => {
    if (item.isLeaf && item.parameters && item.parameters.docsOnly) {
      componentIdToLeafId[item.parent] = item.id;
      return false; // filter it out
    }
    return true;
  });

  const docsOnlyComponentsCollapsed = docsOnlyStoriesRemoved.map((item) => {
    // collapse docs-only components
    const { isComponent, children, id } = item;
    if (isComponent && children.length === 1) {
      const leafId = componentIdToLeafId[id];
      if (leafId) {
        const collapsed = {
          ...item,
          id: leafId,
          isLeaf: true,
          children: [] as string[],
        };
        return collapsed;
      }
    }

    // update groups
    if (children) {
      const rewritten = children.map((child) => componentIdToLeafId[child] || child);
      return { ...item, children: rewritten };
    }

    // pass through stories unmodified
    return item;
  });

  const result = {} as StoriesHash;
  docsOnlyComponentsCollapsed.forEach((item) => {
    result[item.id] = item as Item;
  });
  return result;
};

export const ExpanderContext = React.createContext<{
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  expandedSet: BooleanSet;
}>({
  setExpanded: () => {},
  expandedSet: {},
});

const useExpanded = (
  type: FilteredType,
  parents: Item[],
  initialFiltered: BooleanSet,
  initialUnfiltered: BooleanSet
) => {
  const expandedSets = {
    filtered: useState(initialFiltered),
    unfiltered: useState(initialUnfiltered),
  };
  const [state, setState] = expandedSets[type];
  useEffect(() => {
    expandedSets.filtered[1](initialFiltered);
    expandedSets.unfiltered[1](initialUnfiltered);
  }, [initialFiltered, initialUnfiltered]);
  const set = useMemo(
    () => ({
      ...state,
      ...parents.reduce((acc, item) => ({ ...acc, [item.id]: true }), {} as BooleanSet),
    }),
    [state, parents]
  );
  return { expandedSet: set, setExpanded: setState };
};

const useSelected = (dataset: DataSet, storyId: string) => {
  return useMemo(() => {
    return Object.keys(dataset).reduce(
      (acc, k) => Object.assign(acc, { [k]: k === storyId }),
      {} as BooleanSet
    );
  }, [dataset, storyId]);
};

const useFiltered = (dataset: DataSet, filter: string, parents: Item[], storyId: string) => {
  const extra = useMemo(() => {
    if (dataset[storyId]) {
      return parents.reduce(
        (acc, item) => ({ ...acc, [item.id]: item }),
        dataset[storyId]
          ? {
              [storyId]: dataset[storyId],
            }
          : {}
      );
    }
    return {};
  }, [parents]);
  const filteredSet = useMemo(() => (filter ? toFiltered(dataset, filter) : dataset), [
    dataset,
    filter,
  ]);
  return useMemo(
    () =>
      filteredSet[storyId]
        ? filteredSet
        : {
            ...extra,
            ...filteredSet,
          },
    [extra, filteredSet]
  );
};

export const useDataset = (storiesHash: DataSet = {}, filter: string, storyId: string) => {
  const dataset = useMemo(() => {
    return DOCS_MODE ? collapseAllStories(storiesHash) : collapseDocsOnlyStories(storiesHash);
  }, [DOCS_MODE, storiesHash]);

  const emptyInitial = useMemo(
    () => ({
      filtered: {},
      unfiltered: {},
    }),
    []
  );
  const datasetKeys = useMemo(() => Object.keys(dataset), [dataset]);
  const initial = useMemo(() => {
    if (datasetKeys.length) {
      return Object.keys(dataset).reduce(
        (acc, k) => {
          acc.filtered[k] = true;
          acc.unfiltered[k] = false;
          return acc;
        },
        { filtered: {} as BooleanSet, unfiltered: {} as BooleanSet }
      );
    }
    return emptyInitial;
  }, [dataset]);
  const type: FilteredType = filter.length >= 2 ? 'filtered' : 'unfiltered';
  const parents = useMemo(() => getParents(storyId, dataset), [dataset[storyId]]);
  const { expandedSet, setExpanded } = useExpanded(
    type,
    parents,
    initial.filtered,
    initial.unfiltered
  );
  const selectedSet = useSelected(dataset, storyId);
  const filteredSet = useFiltered(dataset, filter, parents, storyId);
  const length = useMemo(() => Object.keys(filteredSet).length, [filteredSet]);
  const topLevel = useMemo(
    () =>
      Object.values(filteredSet).filter(
        (i) => (i.depth === 0 && !isRootFn(i)) || (!isRootFn(i) && isRootFn(filteredSet[i.parent]))
      ),
    [filteredSet]
  );
  useEffect(() => {
    if (type === 'filtered') {
      if (topLevel.length < 18) {
        setExpanded(initial.filtered);
      } else {
        setExpanded(initial.unfiltered);
      }
    }
  }, [filter]);
  const { roots, others } = useMemo(
    () =>
      getMains(filteredSet).reduce(
        (acc, item) => {
          return isRootFn(item)
            ? Object.assign(acc, { roots: [...acc.roots, item] })
            : Object.assign(acc, { others: [...acc.others, item] });
        },
        { roots: [] as Item[], others: [] as Item[] }
      ),
    [filteredSet]
  );
  return {
    roots,
    others,
    length,
    dataSet: filteredSet,
    selectedSet,
    expandedSet,
    setExpanded,
  };
};
