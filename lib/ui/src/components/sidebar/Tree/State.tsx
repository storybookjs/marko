import React, { useMemo, useState, useEffect } from 'react';
import { isRoot } from '@storybook/api';
import { toFiltered, getMains, getParents } from './utils';
import { BooleanSet, FilteredType, Item, DataSet } from '../RefHelpers';

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

export const useDataset = (dataset: DataSet = {}, filter: string, storyId: string) => {
  const emptyInitial = useMemo(
    () => ({
      filtered: {},
      unfiltered: {},
    }),
    []
  );
  const datasetKeys = Object.keys(dataset);
  const initial = useMemo(() => {
    if (datasetKeys.length) {
      return Object.keys(dataset).reduce(
        (acc, k) => ({
          filtered: { ...acc.filtered, [k]: true },
          unfiltered: { ...acc.unfiltered, [k]: false },
        }),
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
        (i) => (i.depth === 0 && !isRoot(i)) || (!isRoot(i) && isRoot(filteredSet[i.parent]))
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
          return isRoot(item)
            ? { ...acc, roots: [...acc.roots, item] }
            : { ...acc, others: [...acc.others, item] };
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
